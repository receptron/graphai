import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, ModelParams } from "@google/generative-ai";

import { GraphAILLMInputBase, getMergeValue, GraphAILlmMessage, getMessages } from "@graphai/llm_utils";

type GeminiInputs = {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  tools?: Array<Record<string, any>>;
  // tool_choice?: any;
  messages?: Array<GraphAILlmMessage>;
} & GraphAILLMInputBase;

type GeminiConfig = {
  apiKey?: string;
  stream?: boolean;
};

type GeminiParams = GeminiInputs & GeminiConfig;

export const geminiAgent: AgentFunction<GeminiParams, Record<string, any> | string, GeminiInputs, GeminiConfig> = async ({
  params,
  namedInputs,
  config,
  filterParams,
}) => {
  const { model, system, temperature, max_tokens, tools, prompt, messages } = { ...params, ...namedInputs };

  const { apiKey, stream } = {
    ...params,
    ...(config || {}),
  };

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);
  const systemPrompt = getMergeValue(namedInputs, params, "mergeableSystem", system);

  const messagesCopy = getMessages(systemPrompt, messages);

  if (userPrompt) {
    messagesCopy.push({
      role: "user",
      content: userPrompt,
    });
  }

  const lastMessage = messagesCopy.pop();

  if (!lastMessage) {
    return [];
  }

  const key = apiKey ?? (process !== undefined ? process.env["GOOGLE_GENAI_API_KEY"] : null);
  assert(!!key, "GOOGLE_GENAI_API_KEY is missing in the environment.");
  const genAI = new GoogleGenerativeAI(key);
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];
  const modelParams: ModelParams = {
    model: model ?? "gemini-pro",
    safetySettings,
  };
  if (tools) {
    const functions = tools.map((tool: any) => {
      return tool.function;
    });
    modelParams.tools = [{ functionDeclarations: functions }];
  }
  const genModel = genAI.getGenerativeModel(modelParams);
  const generationConfig = {
    maxOutputTokens: max_tokens,
    temperature,
    // topP: 0.1,
    // topK: 16,
  };
  const chat = genModel.startChat({
    history: messagesCopy.map((message) => {
      const role = message.role === "assistant" ? "model" : message.role;
      if (role === "system") {
        // Gemini does not have the concept of system message
        return { role: "user", parts: [{ text: "System Message: " + message.content }] };
      }
      return { role, parts: [{ text: message.content }] };
    }),
    generationConfig,
  });

  if (stream) {
    const result = await chat.sendMessageStream(lastMessage.content);
    const chunks = [];
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (filterParams && filterParams.streamTokenCallback && chunkText) {
        filterParams.streamTokenCallback(chunkText);
      }
      chunks.push(chunkText);
    }
    const text = chunks.join("");
    const message: any = { role: "assistant", content: text };
    return { choices: [{ message }], text, message };
  }

  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;
  const text = response.text();
  const message: any = { role: "assistant", content: text };
  // [":llm.choices.$0.message.tool_calls.$0.function.arguments"],
  const calls = result.response.functionCalls();
  if (calls) {
    message.tool_calls = calls.map((call) => {
      return { function: { name: call.name, arguments: JSON.stringify(call.args) } };
    });
  }
  const tool =
    calls && calls[0]
      ? {
          name: calls[0].name,
          arguments: calls[0].args,
        }
      : undefined;

  return { choices: [{ message }], text, tool, message };
};

const geminiAgentInfo: AgentFunctionInfo = {
  name: "geminiAgent",
  agent: geminiAgent,
  mock: geminiAgent,
  inputs: {
    type: "object",
    properties: {
      model: { type: "string" },
      system: { type: "string" },
      tools: { type: "object" },
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
  description: "Gemini Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
  stream: true,
  npms: ["@anthropic-ai/sdk"],
  environmentVariables: ["GOOGLE_GENAI_API_KEY"],
};

export default geminiAgentInfo;
