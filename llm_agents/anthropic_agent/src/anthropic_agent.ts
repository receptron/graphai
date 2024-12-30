import Anthropic from "@anthropic-ai/sdk";
import { AgentFunction, AgentFunctionInfo } from "graphai";

import { GraphAILLMInputBase, getMergeValue } from "@graphai/llm_utils";

type AnthropicInputs = {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  // tools?: any;
  // tool_choice?: any;
  messages?: Array<Record<string, any>>;
} & GraphAILLMInputBase;

type AnthropicConfig = {
  apiKey?: string;
  stream?: boolean;
  forWeb?: boolean;
};

type AnthropicParams = AnthropicInputs & AnthropicConfig;

type AnthropicResult = Record<string, any> | string;

// https://docs.anthropic.com/ja/api/messages

export const anthropicAgent: AgentFunction<AnthropicParams, AnthropicResult, AnthropicInputs, AnthropicConfig> = async ({
  params,
  namedInputs,
  filterParams,
  config,
}) => {
  const { model, system, temperature, max_tokens, prompt, messages } = { ...params, ...namedInputs };

  const { apiKey, stream, forWeb } = {
    ...params,
    ...(config || {}),
  };

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);
  const systemPrompt = getMergeValue(namedInputs, params, "mergeableSystem", system);

  const messagesCopy: Array<any> = messages ? messages.map((m) => m) : [];

  if (userPrompt) {
    messagesCopy.push({
      role: "user",
      content: userPrompt,
    });
  }

  const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: !!forWeb });
  const opt = {
    model: model ?? "claude-3-5-sonnet-20241022",
    messages: messagesCopy,
    system: systemPrompt,
    temperature: temperature ?? 0.7,
    max_tokens: max_tokens ?? 1024,
  };
  if (!stream) {
    const messageResponse = await anthropic.messages.create(opt);
    // SDK bug https://github.com/anthropics/anthropic-sdk-typescript/issues/432
    const content = (messageResponse.content[0] as Anthropic.TextBlock).text;
    const message = { role: messageResponse.role, content };
    messagesCopy.push(message);
    return { choices: [{ message }], text: content, message, messages: messagesCopy };
  }
  const chatStream = await anthropic.messages.create({
    ...opt,
    stream: true,
  });
  const contents = [];
  for await (const messageStreamEvent of chatStream) {
    // console.log(messageStreamEvent.type);
    if (messageStreamEvent.type === "content_block_delta" && messageStreamEvent.delta.type === "text_delta") {
      const token = messageStreamEvent.delta.text;
      contents.push(token);
      if (filterParams && filterParams.streamTokenCallback && token) {
        filterParams.streamTokenCallback(token);
      }
    }
  }
  const content = contents.join("");
  const message = { role: "assistant", content: content };
  messagesCopy.push(message);
  return { choices: [{ message }], text: content, message, messages: messagesCopy };
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
