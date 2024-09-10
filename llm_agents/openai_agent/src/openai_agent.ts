import OpenAI from "openai";
import { AgentFunction, AgentFunctionInfo, sleep } from "graphai";
import { GraphAILLMInputBase, getMergeValue, getMessages, GraphAILlmMessage } from "@graphai/llm_utils";

type OpenAIMessageContent = OpenAI.ChatCompletionContentPart | OpenAI.ChatCompletionContentPart[] | string;

type OpenAIInputs = {
  model?: string;
  images?: string[];
  tools?: OpenAI.ChatCompletionTool[];
  tool_choice?: OpenAI.ChatCompletionToolChoiceOption;
  max_tokens?: number;
  verbose?: boolean;
  temperature?: number;
  baseURL?: string;
  apiKey?: string;
  stream?: boolean;
  messages?: Array<GraphAILlmMessage<OpenAIMessageContent>>;
  forWeb?: boolean;
} & GraphAILLMInputBase;

export const openAIAgent: AgentFunction<OpenAIInputs, Record<string, any> | string, string | Array<any>, OpenAIInputs> = async ({
  filterParams,
  params,
  namedInputs,
}) => {
  const { verbose, system, images, temperature, tools, tool_choice, max_tokens, baseURL, apiKey, stream, prompt, messages, forWeb } = {
    ...params,
    ...namedInputs,
  };

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);
  const systemPrompt = getMergeValue(namedInputs, params, "mergeableSystem", system);

  const messagesCopy = getMessages<OpenAIMessageContent>(systemPrompt, messages);

  if (userPrompt) {
    messagesCopy.push({
      role: "user",
      content: userPrompt,
    });
  }
  if (images) {
    const image_url =
      params.model === "gpt-4-vision-preview"
        ? images[0]
        : {
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
    model: params.model || "gpt-3.5-turbo",
    messages: messagesCopy as unknown as OpenAI.ChatCompletionMessageParam[],
    tools,
    tool_choice,
    max_tokens,
    temperature: temperature ?? 0.7,
  };
  if (!stream) {
    return await openai.chat.completions.create(chatParams);
  }
  const chatStream = openai.beta.chat.completions.stream({
    ...chatParams,
    stream: true,
  });

  for await (const message of chatStream) {
    const token = message.choices[0].delta.content;
    if (filterParams && filterParams.streamTokenCallback && token) {
      filterParams.streamTokenCallback(token);
    }
  }

  const chatCompletion = await chatStream.finalChatCompletion();
  return chatCompletion;
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
  model: "gpt-3.5-turbo-0125",
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
