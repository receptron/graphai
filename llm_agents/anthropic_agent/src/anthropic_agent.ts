import Anthropic from "@anthropic-ai/sdk";
import { AgentFunction, AgentFunctionInfo } from "graphai";

import { GraphAILLMInputBase, getMergeValue } from "@graphai/llm_utils";

type AnthropicInputs = {
  verbose?: boolean;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  tools?: any[];
  tool_choice?: any;
  messages?: Array<Anthropic.MessageParam>;
} & GraphAILLMInputBase;

type AnthropicConfig = {
  apiKey?: string;
  stream?: boolean;
  forWeb?: boolean;
};

type AnthropicParams = AnthropicInputs & AnthropicConfig;

type AnthropicResult = Record<string, any> | string;

const convToolCall = (tool_call: Anthropic.ToolUseBlock) => {
  const { id, name, input } = tool_call;
  return { id, name, arguments: input };
};

// https://docs.anthropic.com/ja/api/messages
const convertOpenAIChatCompletion = (response: any, messages: Anthropic.MessageParam[]) => {
  // SDK bug https://github.com/anthropics/anthropic-sdk-typescript/issues/432

  const text = (response.content[0] as Anthropic.TextBlock).text;
  const functionResponses = response.content.filter((content: Anthropic.TextBlock | Anthropic.ToolUseBlock) => content.type === "tool_use") ?? [];
  const tool_calls = functionResponses.map(convToolCall);
  const tool = tool_calls[0] ? tool_calls[0] : undefined;

  const message = { role: response.role, content };
  messages.push(message);
  return { ...response, choices: [{ message }], text, tool, tool_calls, message, messages };
};

export const anthropicAgent: AgentFunction<AnthropicParams, AnthropicResult, AnthropicInputs, AnthropicConfig> = async ({
  params,
  namedInputs,
  filterParams,
  config,
}) => {
  const { verbose, system, temperature, tools, tool_choice, max_tokens, prompt, messages } = { ...params, ...namedInputs };

  const { apiKey, stream, forWeb, model } = {
    ...params,
    ...(config || {}),
  };

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);
  const systemPrompt = getMergeValue(namedInputs, params, "mergeableSystem", system);

  const messagesCopy: Array<Anthropic.MessageParam> = messages ? messages.map((m) => m) : [];

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
    model: model ?? "claude-3-5-sonnet-latest",
    messages: messagesCopy,
    tools: anthropic_tools,
    tool_choice,
    system: systemPrompt,
    temperature: temperature ?? 0.7,
    max_tokens: max_tokens ?? 1024,
  };

  if (!stream) {
    const messageResponse = await anthropic.messages.create(chatParams);
    return convertOpenAIChatCompletion(messageResponse, messagesCopy);
  }
  const chatStream = await anthropic.messages.create({
    ...chatParams,
    stream: true,
  });
  const contents = [];
  let streamResponse: any = {};
  const partials = [];
  for await (const messageStreamEvent of chatStream) {
    // console.log(messageStreamEvent);
    if (messageStreamEvent.type === "message_start") {
      streamResponse = messageStreamEvent.message;
    }
    if (messageStreamEvent.type === "content_block_start") {
      streamResponse.content.push(messageStreamEvent.content_block);
      partials.push("");
    }
    if (messageStreamEvent.type === "content_block_delta") {
      const { index, delta } = messageStreamEvent;
      // const { type: 'input_json_delta', partial_json: ', "lng": -' }
      // type: 'text_delta', text: ' House location in Washington, DC. The'}
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
        filterParams.streamTokenCallback(token);
      }
    }
  }
  partials.forEach((partial, index) => {
    if (streamResponse.content[index].type === "text") {
      streamResponse.content[index].text = partial;
    }
    if (streamResponse.content[index].type === "tool_use") {
      streamResponse.content[index].input = JSON.parse(partial);
    }
  });

  return convertOpenAIChatCompletion(streamResponse, messagesCopy);
  /*
  
  const content = contents.join("");
  const message = { role: "assistant" as const, content: content };
  messagesCopy.push(message);
  return { choices: [{ message }], text: content, message, messages: messagesCopy };
  */
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
  license: "MIT",
  stream: true,
  environmentVariables: ["ANTHROPIC_API_KEY"],
  npms: ["@anthropic-ai/sdk"],
};

export default anthropicAgentInfo;
