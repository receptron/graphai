import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { Groq } from "groq-sdk";
import {
  ChatCompletionCreateParams,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionTool,
  ChatCompletionMessageParam,
  ChatCompletionAssistantMessageParam,
  ChatCompletionToolChoiceOption,
  ChatCompletion,
} from "groq-sdk/resources/chat/completions";

import {
  GraphAILLMInputBase,
  getMergeValue,
  getMessages,
  LLMMetaData,
  convertMeta,
  initLLMMetaData,
  llmMetaDataEndTime,
  llmMetaDataFirstTokenTime,
} from "@graphai/llm_utils";
import type { GraphAIText, GraphAITool, GraphAIToolCalls, GraphAIMessage, GraphAIMessages } from "@graphai/agent_utils";

type GroqInputs = {
  verbose?: boolean;
  tools?: ChatCompletionTool[];
  temperature?: number;
  max_tokens?: number;
  tool_choice?: ChatCompletionToolChoiceOption;
  messages?: Array<ChatCompletionMessageParam>;
} & GraphAILLMInputBase;

type GroqConfig = {
  apiKey?: string;
  stream?: boolean;
  dataStream?: boolean;
  forWeb?: boolean;
};

type GroqParams = GroqInputs & GroqConfig & { model: string };

type GroqResult = Partial<GraphAIText & GraphAITool & GraphAIToolCalls & GraphAIMessage & GraphAIMessages>;

// https://github.com/groq/groq-typescript

//
// This agent takes two optional inputs, and following parameters.
// inputs:
// - [0]: query string (typically from the user), optional
// - [1]: array of messages from previous conversation, optional
//
// params:
// - model: LLM model (llama-3.1-8b-instant, llama-3.3-70b-versatile, meta-llama/llama-guard-4-12b), required.
// - query: Additional query string from the app to prepend the query from the user, optional.
// - system: System prompt (ignored if inputs[1] is specified), optional
// - tools: Function definitions, optional
// - tool_choice: Tool choice parameter, optional (default = "auto")
// - temperature: Controls randomness of responses, optional (default = 0.7)
// - max_tokens: The maximum number of tokens that the model can process in a single response, optional.
// - verbose: dumps the message array to the debug console, before sending it the LLM.
//
// https://console.groq.com/docs/quickstart
//

const convertOpenAIChatCompletion = (response: ChatCompletion, messages: ChatCompletionMessageParam[], llmMetaData: LLMMetaData) => {
  const message = response?.choices[0] && response?.choices[0].message ? response?.choices[0].message : null;
  const text = message && message.content ? message.content : null;

  // const functionResponse = message?.tool_calls && message?.tool_calls[0] ? message?.tool_calls[0] : null;
  const functionResponses = message?.tool_calls && message?.tool_calls.length > 0 ? message?.tool_calls : [];

  const tool_calls = functionResponses.map((functionResponse) => {
    return {
      id: functionResponse.id,
      name: functionResponse?.function?.name,
      arguments: (() => {
        try {
          return JSON.parse(functionResponse?.function?.arguments);
        } catch (__e) {
          return undefined;
        }
      })(),
    };
  });
  const tool = tool_calls[0] ? tool_calls[0] : undefined;

  if (message) {
    messages.push(message);
  }
  return {
    ...response,
    text,
    tool,
    tool_calls,
    message,
    messages,
    metadata: convertMeta(llmMetaData),
  };
};

export const groqAgent: AgentFunction<GroqParams, GroqResult, GroqInputs, GroqConfig> = async ({ params, namedInputs, filterParams, config }) => {
  const { verbose, system, tools, tool_choice, max_tokens, temperature, prompt, messages } = { ...params, ...namedInputs };

  const { apiKey, stream, dataStream, forWeb, model } = {
    ...params,
    ...(config || {}),
  };
  const key = apiKey ?? (process !== undefined ? process.env.GROQ_API_KEY : undefined);
  assert(key !== undefined, "The GROQ_API_KEY environment variable adn apiKey is missing.");
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: !!forWeb });

  const llmMetaData = initLLMMetaData();

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);
  const systemPrompt = getMergeValue(namedInputs, params, "mergeableSystem", system);

  // Notice that we ignore params.system if previous_message exists.
  const messagesCopy = getMessages<ChatCompletionMessageParam>(systemPrompt, messages);

  if (userPrompt) {
    messagesCopy.push({
      role: "user",
      content: userPrompt,
    });
  }

  if (verbose) {
    console.log(messagesCopy);
  }
  const streamOption: ChatCompletionCreateParamsStreaming = {
    messages: messagesCopy,
    model,
    temperature: temperature ?? 0.7,
    stream: true,
  };
  const nonStreamOption: ChatCompletionCreateParamsNonStreaming = {
    messages: messagesCopy,
    model,
    temperature: temperature ?? 0.7,
  };

  const options: ChatCompletionCreateParams = stream || dataStream ? streamOption : nonStreamOption;
  if (max_tokens) {
    options.max_tokens = max_tokens;
  }
  if (tools) {
    options.tools = tools;
    options.tool_choice = tool_choice ?? ("auto" as const);
  }
  if (!options.stream) {
    const result = await groq.chat.completions.create(options);
    llmMetaDataEndTime(llmMetaData);
    return convertOpenAIChatCompletion(result, messagesCopy, llmMetaData);
  }
  // streaming
  const pipe = await groq.chat.completions.create(options);
  let lastMessage = null;
  const contents = [];

  if (dataStream && filterParams && filterParams.streamTokenCallback) {
    filterParams.streamTokenCallback({
      type: "response.created",
      response: {},
    });
  }
  for await (const _message of pipe) {
    llmMetaDataFirstTokenTime(llmMetaData);
    const token = _message.choices[0].delta.content;
    if (token) {
      if (filterParams && filterParams.streamTokenCallback) {
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
      contents.push(token);
    }
    lastMessage = _message as any;
  }
  if (dataStream && filterParams && filterParams.streamTokenCallback) {
    filterParams.streamTokenCallback({
      type: "response.completed",
      response: {},
    });
  }
  const text = contents.join("");
  const message: ChatCompletionAssistantMessageParam = { role: "assistant", content: text };
  if (lastMessage) {
    lastMessage.choices[0]["message"] = message;
  }
  // maybe not suppor tool when streaming
  messagesCopy.push(message);

  llmMetaDataEndTime(llmMetaData);
  return {
    ...lastMessage,
    text,
    message,
    messages: messagesCopy,
    metadata: convertMeta(llmMetaData),
  };
};

const groqAgentInfo: AgentFunctionInfo = {
  name: "groqAgent",
  agent: groqAgent,
  mock: groqAgent,
  inputs: {
    type: "object",
    properties: {
      model: { type: "string" },
      system: { type: "string" },
      tools: { type: "object" },
      tool_choice: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
      },
      max_tokens: { type: "number" },
      verbose: { type: "boolean" },
      temperature: { type: "number" },
      stream: { type: "boolean" },
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
  description: "Groq Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/sleeper_agents/src/sleep_and_merge_agent.ts",
  package: "@graphai/groq_agent",
  license: "MIT",

  stream: true,
  npms: ["groq-sdk"],
  environmentVariables: ["GROQ_API_KEY"],
};

export default groqAgentInfo;
