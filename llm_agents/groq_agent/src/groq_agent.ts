import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { Groq } from "groq-sdk";
import {
  ChatCompletionCreateParams,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionTool,
  ChatCompletionMessageParam,
  ChatCompletionToolChoiceOption,
} from "groq-sdk/resources/chat/completions";

import { GraphAILLMInputBase, getMergeValue, getMessages } from "@graphai/llm_utils";

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : undefined;

type GroqInputs = {
  verbose?: boolean;
  tools?: ChatCompletionTool[];
  temperature?: number;
  max_tokens?: number;
  tool_choice?: ChatCompletionToolChoiceOption;
  stream?: boolean;
  messages?: Array<ChatCompletionMessageParam>;
} & GraphAILLMInputBase;

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
export const groqAgent: AgentFunction<
  GroqInputs & { model: string },
  // Groq.Chat.ChatCompletion,
  any,
  string | Array<ChatCompletionMessageParam>,
  GroqInputs
> = async ({ params, namedInputs, filterParams }) => {
  assert(groq !== undefined, "The GROQ_API_KEY environment variable is missing.");
  const { verbose, system, tools, tool_choice, max_tokens, temperature, stream, prompt, messages } = { ...params, ...namedInputs };

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
    model: params.model,
    temperature: temperature ?? 0.7,
    stream: true,
  };
  const nonStreamOption: ChatCompletionCreateParamsNonStreaming = {
    messages: messagesCopy,
    model: params.model,
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
    return {
      ...result,
      text: result && result.choices ? result.choices[0].message["content"] : "",
    };
  }
  // streaming
  const pipe = await groq.chat.completions.create(options);
  let lastMessage = null;
  const contents = [];
  for await (const message of pipe) {
    const token = message.choices[0].delta.content;
    if (token) {
      if (filterParams && filterParams.streamTokenCallback) {
        filterParams.streamTokenCallback(token);
      }
      contents.push(token);
    }
    lastMessage = message as any;
  }
  if (lastMessage) {
    lastMessage.choices[0]["message"] = { role: "assistant", content: contents.join("") };
  }
  return {
    ...lastMessage,
    text: contents.join(""),
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
