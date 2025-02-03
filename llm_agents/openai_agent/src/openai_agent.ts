import OpenAI from "openai";
import { AgentFunction, AgentFunctionInfo, sleep } from "graphai";
import { GraphAILLMInputBase, getMergeValue, getMessages } from "@graphai/llm_utils";

type OpenAIInputs = {
  model?: string;
  images?: string[];
  tools?: OpenAI.ChatCompletionTool[];
  tool_choice?: OpenAI.ChatCompletionToolChoiceOption;
  max_tokens?: number;
  verbose?: boolean;
  temperature?: number;
  messages?: Array<OpenAI.ChatCompletionMessageParam>;
  response_format?: OpenAI.ResponseFormatText | OpenAI.ResponseFormatJSONObject | OpenAI.ResponseFormatJSONSchema;
} & GraphAILLMInputBase;

type OpenAIConfig = {
  baseURL?: string;
  apiKey?: string;
  stream?: boolean;
  forWeb?: boolean;
  model?: string;
};

type OpenAIParams = OpenAIInputs & OpenAIConfig;

type OpenAIResult = Record<string, any> | string;

const convToolCall = (tool_call: OpenAI.Chat.Completions.ChatCompletionMessageToolCall) => {
  return {
    id: tool_call.id,
    name: tool_call.function.name,
    arguments: (() => {
      try {
        return JSON.parse(tool_call.function.arguments);
      } catch (__e) {
        console.log(__e);
        return undefined;
      }
    })(),
  };
};

const convertOpenAIChatCompletion = (response: OpenAI.ChatCompletion, messages: OpenAI.ChatCompletionMessageParam[]) => {
  const newMessage = response?.choices[0] && response?.choices[0].message ? response?.choices[0].message : null;
  const text = newMessage && newMessage.content ? newMessage.content : null;

  const functionResponses = newMessage?.tool_calls && Array.isArray(newMessage?.tool_calls) ? newMessage?.tool_calls : [];
  // const functionId = message?.tool_calls && message?.tool_calls[0] ? message?.tool_calls[0]?.id : null;
  
  const tool_calls = functionResponses.map(convToolCall);
  const tool = tool_calls && tool_calls.length > 0 ? tool_calls[0] : undefined;

  const message = (() => {
    if (newMessage) {
      const { content, role, tool_calls } = newMessage;
      if (tool_calls && tool_calls.length > 0) {
        return {
          content,
          role,
          tool_calls,
        };
      }
      return {
        content,
        role,
      };
    }
    return null;
  })();

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

export const openAIAgent: AgentFunction<OpenAIParams, OpenAIResult, OpenAIInputs, OpenAIConfig> = async ({ filterParams, params, namedInputs, config }) => {
  const { verbose, system, images, temperature, tools, tool_choice, max_tokens, prompt, messages, response_format } = {
    ...params,
    ...namedInputs,
  };

  const { apiKey, stream, forWeb, model, baseURL } = {
    ...(config || {}),
    ...params,
  };

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);
  const systemPrompt = getMergeValue(namedInputs, params, "mergeableSystem", system);

  const messagesCopy = getMessages<OpenAI.ChatCompletionMessageParam>(systemPrompt, messages);

  if (userPrompt) {
    messagesCopy.push({
      role: "user",
      content: userPrompt,
    });
  }
  if (images) {
    const image_url = {
      url: images[0],
      detail: "high",
    };
    messagesCopy.push({
      role: "user",
      content: [
        {
          type: "image_url",
          image_url,
        } as OpenAI.ChatCompletionContentPart,
      ],
    });
  }

  if (verbose) {
    console.log(messagesCopy);
  }

  const openai = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: !!forWeb });

  const chatParams = {
    model: model || "gpt-4o",
    messages: messagesCopy as unknown as OpenAI.ChatCompletionMessageParam[],
    tools,
    tool_choice,
    max_tokens,
    temperature: temperature ?? 0.7,
    response_format,
  };

  if (!stream) {
    const result = await openai.chat.completions.create(chatParams);
    return convertOpenAIChatCompletion(result, messagesCopy);
  }
  const chatStream = openai.beta.chat.completions.stream({
    ...chatParams,
    stream: true,
  });

  // streaming
  for await (const message of chatStream) {
    const token = message.choices[0].delta.content;
    if (filterParams && filterParams.streamTokenCallback && token) {
      filterParams.streamTokenCallback(token);
    }
  }

  const chatCompletion = await chatStream.finalChatCompletion();
  return convertOpenAIChatCompletion(chatCompletion, messagesCopy);
};

const input_sample = "this is response result";
const result_sample = {
  object: "chat.completion",
  id: "chatcmpl-9N7HxXYbwjmdbdiQE94MHoVluQhyt",
  choices: [
    {
      message: {
        role: "assistant",
        content: input_sample,
      },
      finish_reason: "stop",
      index: 0,
      logprobs: null,
    },
  ],
  created: 1715296589,
  model: "gpt-4o",
};

export const openAIMockAgent: AgentFunction<
  {
    model?: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    temperature?: number;
  },
  Record<string, any> | string,
  string | Array<any>
> = async ({ filterParams }) => {
  for await (const token of input_sample.split("")) {
    if (filterParams && filterParams.streamTokenCallback && token) {
      await sleep(100);
      filterParams.streamTokenCallback(token);
    }
  }

  return result_sample;
};
const openaiAgentInfo: AgentFunctionInfo = {
  name: "openAIAgent",
  agent: openAIAgent,
  mock: openAIMockAgent,
  inputs: {
    type: "object",
    properties: {
      model: { type: "string" },
      system: { type: "string" },
      tools: { type: "object" },
      tool_choice: {
        anyOf: [{ type: "array" }, { type: "object" }],
      },
      max_tokens: { type: "number" },
      verbose: { type: "boolean" },
      temperature: { type: "number" },
      baseURL: { type: "string" },
      apiKey: {
        anyOf: [{ type: "string" }, { type: "object" }],
      },
      stream: { type: "boolean" },
      prompt: {
        type: "string",
        description: "query string",
      },
      messages: {
        anyOf: [{ type: "string" }, { type: "object" }, { type: "array" }],
        description: "chat messages",
      },
    },
  },
  output: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
      object: {
        type: "string",
      },
      created: {
        type: "integer",
      },
      model: {
        type: "string",
      },
      choices: {
        type: "array",
        items: [
          {
            type: "object",
            properties: {
              index: {
                type: "integer",
              },
              message: {
                type: "array",
                items: [
                  {
                    type: "object",
                    properties: {
                      content: {
                        type: "string",
                      },
                      role: {
                        type: "string",
                      },
                    },
                    required: ["content", "role"],
                  },
                ],
              },
            },
            required: ["index", "message", "logprobs", "finish_reason"],
          },
        ],
      },
      usage: {
        type: "object",
        properties: {
          prompt_tokens: {
            type: "integer",
          },
          completion_tokens: {
            type: "integer",
          },
          total_tokens: {
            type: "integer",
          },
        },
        required: ["prompt_tokens", "completion_tokens", "total_tokens"],
      },
      text: {
        type: "string",
      },
      tool: {
        arguments: {
          type: "object",
        },
        name: {
          type: "string",
        },
      },
      message: {
        type: "object",
        properties: {
          content: {
            type: "string",
          },
          role: {
            type: "string",
          },
        },
        required: ["content", "role"],
      },
    },
    required: ["id", "object", "created", "model", "choices", "usage"],
  },
  params: {
    type: "object",
    properties: {
      model: { type: "string" },
      system: { type: "string" },
      tools: { type: "object" },
      tool_choice: { anyOf: [{ type: "array" }, { type: "object" }] },
      max_tokens: { type: "number" },
      verbose: { type: "boolean" },
      temperature: { type: "number" },
      baseURL: { type: "string" },
      apiKey: { anyOf: [{ type: "string" }, { type: "object" }] },
      stream: { type: "boolean" },
      prompt: { type: "string", description: "query string" },
      messages: { anyOf: [{ type: "string" }, { type: "object" }, { type: "array" }], description: "chat messages" },
    },
  },
  outputFormat: {
    llmResponse: {
      key: "choices.$0.message.content",
      type: "string",
    },
  },
  samples: [
    {
      inputs: { prompt: input_sample },
      params: {},
      result: result_sample,
    },
  ],
  description: "OpenAI Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
  stream: true,
  npms: ["openai"],
  environmentVariables: ["OPENAI_API_KEY"],
};

export default openaiAgentInfo;
