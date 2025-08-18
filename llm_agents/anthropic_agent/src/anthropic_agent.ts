import Anthropic from "@anthropic-ai/sdk";
import { AgentFunction, AgentFunctionInfo } from "graphai";

import {
  GraphAILLMInputBase,
  GraphAILLInputType,
  getMergeValue,
  LLMMetaData,
  convertMeta,
  initLLMMetaData,
  llmMetaDataEndTime,
  llmMetaDataFirstTokenTime,
} from "@graphai/llm_utils";
import type { GraphAIText, GraphAITool, GraphAIToolCalls, GraphAIMessage, GraphAIMessages } from "@graphai/agent_utils";

type AnthropicInputs = {
  verbose?: boolean;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  tools?: any[];
  tool_choice?: any;
  messages?: Array<Anthropic.MessageParam>;
  response_format?: any;
} & GraphAILLMInputBase;

type AnthropicConfig = {
  apiKey?: string;
  stream?: boolean;
  dataStream?: boolean;
  forWeb?: boolean;
};

type AnthropicParams = AnthropicInputs & AnthropicConfig;

type AnthropicResult = Partial<
  GraphAIText &
    GraphAITool &
    GraphAIToolCalls &
    GraphAIMessage<string | Anthropic.ContentBlockParam[]> &
    GraphAIMessages<string | Anthropic.ContentBlockParam[]>
>;

const convToolCall = (tool_call: Anthropic.ToolUseBlock) => {
  const { id, name, input } = tool_call;
  return { id, name, arguments: input };
};

type Response = Anthropic.Message & { _request_id?: string | null | undefined };

export const anthoropicTool2OpenAITool = (response: Response) => {
  const contentText = response.content
    .filter((c): c is Anthropic.TextBlock => c.type === "text")
    .map((b) => b.text ?? "")
    .join(" ");

  const tool_calls = response.content
    .filter((c): c is Anthropic.Messages.ToolUseBlock => c.type === "tool_use")
    .map((content) => {
      const { id, name, input } = content;
      return {
        id,
        type: "function",
        function: {
          name,
          arguments: (() => {
            try {
              return JSON.stringify(input ?? {});
            } catch (__e) {
              return "{}";
            }
          })(),
        },
      };
    });
  if (tool_calls.length > 0) {
    return {
      role: response.role,
      content: contentText,
      tool_calls,
    };
  }
  return { role: response.role, content: contentText };
};
// https://docs.anthropic.com/ja/api/messages
const convertOpenAIChatCompletion = (response: Response, messages: Anthropic.MessageParam[], llmMetaData: LLMMetaData, maybeResponseFormat: boolean) => {
  llmMetaDataEndTime(llmMetaData);

  // SDK bug https://github.com/anthropics/anthropic-sdk-typescript/issues/432

  const text = (response.content[0] as Anthropic.TextBlock).text;
  const functionResponses = response.content.filter((content) => content.type === "tool_use") ?? [];
  const tool_calls = functionResponses.map(convToolCall);
  const tool = tool_calls[0] ? tool_calls[0] : undefined;

  const message = anthoropicTool2OpenAITool(response);
  const responseFormat = (() => {
    if (maybeResponseFormat && text) {
      const parsed = JSON.parse(text);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed;
      }
    }
    return null;
  })();

  const { usage } = response;

  const extraUsage = usage
    ? {
        prompt_tokens: usage.input_tokens,
        completion_tokens: usage.output_tokens,
        total_tokens: usage.input_tokens + usage.output_tokens,
      }
    : {};

  return {
    ...response,
    choices: [{ message }],
    text,
    tool,
    tool_calls,
    message,
    messages,
    metadata: convertMeta(llmMetaData),
    responseFormat,
    usage: { ...usage, ...extraUsage },
  };
};

export const system_with_response_format = (system: GraphAILLInputType, response_format?: any) => {
  if (response_format) {
    if (system) {
      return [
        "Please return the following json object for the specified content.",
        JSON.stringify(response_format, null, 2),
        "",
        "<description>",
        system,
        "</description>",
      ].join("\n");
    }
    return ["Please return the following json object for the specified content.", JSON.stringify(response_format, null, 2)].join("\n");
  }
  return system;
};

export const convOpenAIToolsToAnthropicToolMessage = (messages: any[]) => {
  return messages.reduce((tmp: any[], message: any) => {
    if (message.role === "assistant" && message.tool_calls) {
      const content: { type: string; text?: string; id?: string; name?: string; input?: unknown }[] = [
        {
          type: "text",
          text: message.content || "run tools",
        },
      ];
      message.tool_calls.forEach((tool: { id: string; function: { name: string; arguments: string } }) => {
        const { id, function: func } = tool;
        const { name, arguments: args } = func ?? {};

        content.push({
          type: "tool_use",
          id,
          name,
          input: (() => {
            try {
              return JSON.parse(args ?? "{}");
            } catch (__e) {
              return {};
            }
          })(),
        });
      });
      tmp.push({
        role: "assistant",
        content,
      });
    } else if (message.role === "tool") {
      const last = tmp[tmp.length - 1];
      if (last?.role === "user" && last?.content?.[0]?.type === "tool_result") {
        tmp[tmp.length - 1].content.push({
          type: "tool_result",
          tool_use_id: message.tool_call_id,
          content: message.content,
        });
      } else {
        tmp.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: message.tool_call_id,
              content: message.content,
            },
          ],
        });
      }
    } else {
      tmp.push(message);
    }
    return tmp;
  }, []);
};

export const anthropicAgent: AgentFunction<AnthropicParams, AnthropicResult, AnthropicInputs, AnthropicConfig> = async ({
  params,
  namedInputs,
  filterParams,
  config,
}) => {
  const { verbose, system, temperature, tools, tool_choice, max_tokens, prompt, messages, response_format } = { ...params, ...namedInputs };

  const { apiKey, stream, dataStream, forWeb, model } = {
    ...params,
    ...(config || {}),
  };

  const llmMetaData = initLLMMetaData();

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);
  const systemPrompt = getMergeValue(namedInputs, params, "mergeableSystem", system_with_response_format(system, response_format));

  const messagesCopy: Array<Anthropic.MessageParam> = messages ? messages.map((m) => m) : [];
  const messageSystemPrompt = messagesCopy[0] && (messagesCopy[0] as any).role === "system" ? (messagesCopy[0].content as string) : "";

  if (userPrompt) {
    messagesCopy.push({
      role: "user",
      content: userPrompt,
    });
  }
  if (verbose) {
    console.log(messagesCopy);
  }
  const anthropic_tools =
    tools && tools.length > 0
      ? tools.map((tool) => {
          const { function: func } = tool;
          const { name, description, parameters } = func;
          return {
            name,
            description,
            input_schema: parameters,
          };
        })
      : undefined;

  const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: !!forWeb });
  const chatParams = {
    model: model || "claude-3-7-sonnet-20250219",
    messages: convOpenAIToolsToAnthropicToolMessage(messagesCopy.filter((m) => (m.role as any) !== "system")),
    tools: anthropic_tools,
    tool_choice,
    system: systemPrompt || messageSystemPrompt,
    temperature: temperature ?? 0.7,
    max_tokens: max_tokens ?? 8192,
  };

  if (!stream && !dataStream) {
    const messageResponse = await anthropic.messages.create(chatParams);
    return convertOpenAIChatCompletion(messageResponse, messagesCopy, llmMetaData, !!response_format);
  }
  const chatStream = await anthropic.messages.create({
    ...chatParams,
    stream: true,
  });
  const contents = [];
  const partials = [];
  let streamResponse: Response | null = null;

  if (dataStream && filterParams && filterParams.streamTokenCallback) {
    filterParams.streamTokenCallback({
      type: "response.created",
      response: {},
    });
  }
  for await (const messageStreamEvent of chatStream) {
    llmMetaDataFirstTokenTime(llmMetaData);
    if (messageStreamEvent.type === "message_start") {
      streamResponse = messageStreamEvent.message;
    }
    if (messageStreamEvent.type === "content_block_start") {
      if (streamResponse) {
        streamResponse.content.push(messageStreamEvent.content_block);
      }
      partials.push("");
    }
    if (messageStreamEvent.type === "content_block_delta") {
      const { index, delta } = messageStreamEvent;
      if (delta.type === "input_json_delta") {
        partials[index] = partials[index] + delta.partial_json;
      }
      if (delta.type === "text_delta") {
        partials[index] = partials[index] + delta.text;
      }
    }
    if (messageStreamEvent.type === "content_block_delta" && messageStreamEvent.delta.type === "text_delta") {
      const token = messageStreamEvent.delta.text;
      contents.push(token);
      if (filterParams && filterParams.streamTokenCallback && token) {
        if (dataStream) {
          filterParams.streamTokenCallback({
            type: "response.in_progress",
            response: {
              output: [
                {
                  type: "text",
                  text: token,
                },
              ],
            },
          });
        } else {
          filterParams.streamTokenCallback(token);
        }
      }
    }
  }
  if (dataStream && filterParams && filterParams.streamTokenCallback) {
    filterParams.streamTokenCallback({
      type: "response.completed",
      response: {},
    });
  }
  if (streamResponse === null) {
    throw new Error("Anthoropic no response");
  }
  partials.forEach((partial, index) => {
    if (streamResponse.content[index].type === "text") {
      streamResponse.content[index].text = partial;
    }
    if (streamResponse.content[index].type === "tool_use") {
      streamResponse.content[index].input = JSON.parse(partial);
    }
  });

  return convertOpenAIChatCompletion(streamResponse, messagesCopy, llmMetaData, !!response_format);
};

const anthropicAgentInfo: AgentFunctionInfo = {
  name: "anthropicAgent",
  agent: anthropicAgent,
  mock: anthropicAgent,
  inputs: {
    type: "object",
    properties: {
      model: { type: "string" },
      system: { type: "string" },
      max_tokens: { type: "number" },
      temperature: { type: "number" },
      prompt: {
        type: "string",
        description: "query string",
      },
      messages: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
        description: "chat messages",
      },
    },
  },
  output: {
    type: "object",
  },
  samples: [],
  description: "Anthropic Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/llm_agents/anthropic_agent/src/anthropic_agent.ts",
  package: "@graphai/anthropic_agent",
  license: "MIT",
  stream: true,
  environmentVariables: ["ANTHROPIC_API_KEY"],
  npms: ["@anthropic-ai/sdk"],
};

export default anthropicAgentInfo;
