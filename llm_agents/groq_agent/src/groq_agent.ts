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

import { GraphAILLMInputBase, getMergeValue, getMessages } from "@graphai/llm_utils";

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
  forWeb?: boolean;
};

type GroqParams = GroqInputs & GroqConfig & { model: string };

// https://github.com/groq/groq-typescript

//
// This agent takes two optional inputs, and following parameters.
// inputs:
// - [0]: query string (typically from the user), optional
// - [1]: array of messages from previous conversation, optional
//
// params:
// - model: LLM model (Llama3-8b-8192, Llama3-70b-8192, Mixtral-8x7b-32768), required.
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

const convertOpenAIChatCompletion = (response: ChatCompletion, messages: ChatCompletionMessageParam[]) => {
  const message = response?.choices[0] && response?.choices[0].message ? response?.choices[0].message : null;
  const text = message && message.content ? message.content : null;

  // const functionResponse = message?.tool_calls && message?.tool_calls[0] ? message?.tool_calls[0] : null;
  const functionResponses = message?.tool_calls && message?.tool_calls.length > 0 ? message?.tool_calls : [];

  const tool_calls = functionResponses.map(functionResponse => {
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
    }
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
  };
};

export const groqAgent: AgentFunction<GroqParams, any, GroqInputs, GroqConfig> = async ({ params, namedInputs, filterParams, config }) => {
  const { verbose, system, tools, tool_choice, max_tokens, temperature, prompt, messages } = { ...params, ...namedInputs };

  const { apiKey, stream, forWeb, model } = {
    ...params,
    ...(config || {}),
  };
  const key = apiKey ?? (process !== undefined ? process.env.GROQ_API_KEY : undefined);
  assert(key !== undefined, "The GROQ_API_KEY environment variable adn apiKey is missing.");
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: !!forWeb });

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

  const options: ChatCompletionCreateParams = stream ? streamOption : nonStreamOption;
  if (max_tokens) {
    options.max_tokens = max_tokens;
  }
  if (tools) {
    options.tools = tools;
    options.tool_choice = tool_choice ?? ("auto" as const);
  }
  if (!options.stream) {
    const result = await groq.chat.completions.create(options);

    return convertOpenAIChatCompletion(result, messagesCopy);
  }
  // streaming
  const pipe = await groq.chat.completions.create(options);
  let lastMessage = null;
  const contents = [];
  for await (const _message of pipe) {
    const token = _message.choices[0].delta.content;
    if (token) {
      if (filterParams && filterParams.streamTokenCallback) {
        filterParams.streamTokenCallback(token);
      }
      contents.push(token);
    }
    lastMessage = _message as any;
  }
  const text = contents.join("");
  const message: ChatCompletionAssistantMessageParam = { role: "assistant", content: text };
  if (lastMessage) {
    lastMessage.choices[0]["message"] = message;
  }
  // maybe not suppor tool when streaming
  messagesCopy.push(message);
  return {
    ...lastMessage,
    text,
    message,
    messages: messagesCopy,
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
  license: "MIT",

  stream: true,
  npms: ["groq-sdk"],
  environmentVariables: ["GROQ_API_KEY"],
};

export default groqAgentInfo;
