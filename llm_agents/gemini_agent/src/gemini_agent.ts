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

export const geminiAgent: AgentFunction<GeminiInputs, Record<string, any> | string, string | Array<any>, GeminiInputs> = async ({ params, namedInputs }) => {
  const { model, system, temperature, max_tokens, tools, prompt, messages } = { ...params, ...namedInputs };

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

  const key = process.env["GOOGLE_GENAI_API_KEY"];
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
      return { role, parts: [{ text: message.content as unknown as string }] };
    }),
    generationConfig,
  });

  const result = await chat.sendMessage(lastMessage.content as unknown as string);
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
  return { choices: [{ message }] };
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
  // stream: true,
  npms: ["@anthropic-ai/sdk"],
  environmentVariables: ["GOOGLE_GENAI_API_KEY"],
};

export default geminiAgentInfo;
