import { AgentFunction, AgentFunctionInfo, assert, GraphAILogger } from "graphai";
import {
  FunctionCall,
  GenerateContentConfig,
  GenerateContentResponse,
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
  SafetySetting,
  SchemaUnion,
} from "@google/genai";

import {
  GraphAILLMInputBase,
  getMergeValue,
  GraphAILlmMessage,
  getMessages,
  LLMMetaData,
  convertMeta,
  initLLMMetaData,
  llmMetaDataEndTime,
  llmMetaDataFirstTokenTime,
} from "@graphai/llm_utils";

import type { GraphAITool, GraphAIToolCalls, GraphAIMessage } from "@graphai/agent_utils";

type GeminiResponseFormat = {
  type: string;
  json_schema: {
    schema: SchemaUnion;
    strict?: boolean;
  };
};

type GeminiInputs = {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  tools?: Array<Record<string, any>>;
  // tool_choice?: any;
  response_format?: GeminiResponseFormat;
  messages?: Array<GraphAILlmMessage>;
} & GraphAILLMInputBase;

type GeminiConfig = {
  apiKey?: string;
  stream?: boolean;
  dataStream?: boolean;
};

type GeminiParams = GeminiInputs & GeminiConfig;

type GeminiResult = Partial<GraphAITool & GraphAIToolCalls & GraphAIMessage & { messages: GraphAILlmMessage[] }> | [];

const convertOpenAIChatCompletion = (
  response: GenerateContentResponse,
  functionCalls: FunctionCall[],
  messages: GraphAILlmMessage[],
  llmMetaData: LLMMetaData,
) => {
  const text = response.text;
  const message: any = { role: "assistant", content: text };
  // [":llm.choices.$0.message.tool_calls.$0.function.arguments"],
  const calls = functionCalls.length > 0 ? functionCalls : response.functionCalls;
  if (calls) {
    message.tool_calls = calls.map((call) => {
      return { function: { name: call.name, arguments: JSON.stringify(call.args) } };
    });
  }
  const tool_calls = calls
    ? calls.map((call) => {
        return {
          id: "dummy",
          name: call.name ?? "",
          arguments: call.args ?? {},
        };
      })
    : [];
  const tool = tool_calls && tool_calls[0] ? tool_calls[0] : undefined;
  messages.push(message);

  const usageMetadata: any = (response as any).usageMetadata;
  const extraUsage = usageMetadata
    ? {
        prompt_tokens: usageMetadata.promptTokenCount ?? usageMetadata.prompt_tokens,
        completion_tokens: usageMetadata.candidatesTokenCount ?? usageMetadata.completionTokenCount ?? usageMetadata.completion_tokens,
        total_tokens: usageMetadata.totalTokenCount ?? usageMetadata.total_tokens,
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
    usage: usageMetadata ? { ...usageMetadata, ...extraUsage } : undefined,
  };
};

export const geminiAgent: AgentFunction<GeminiParams, GeminiResult, GeminiInputs, GeminiConfig> = async ({ params, namedInputs, config, filterParams }) => {
  const { system, temperature, tools, max_tokens, prompt, messages, response_format } = { ...params, ...namedInputs };

  const { apiKey, stream, dataStream, model } = {
    ...params,
    ...(config || {}),
  };

  const llmMetaData = initLLMMetaData();

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);
  const systemPrompt = getMergeValue(namedInputs, params, "mergeableSystem", system);

  const messagesCopy = getMessages<GraphAILlmMessage>(systemPrompt, messages);

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

  const key = apiKey ?? (typeof process !== "undefined" && typeof process.env !== "undefined" ? process.env["GOOGLE_GENAI_API_KEY"] : null);
  assert(!!key, "GOOGLE_GENAI_API_KEY is missing in the environment.");
  const ai = new GoogleGenAI({ apiKey: key });
  const safetySettings: SafetySetting[] = [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  const generationConfig: GenerateContentConfig = {
    maxOutputTokens: max_tokens,
    safetySettings: safetySettings,
    temperature: temperature,
    // topP: 0.1,
    // topK: 16,
  };
  if (tools) {
    const functions = tools.map((tool: any) => {
      return tool.function;
    });
    generationConfig.tools = [{ functionDeclarations: functions }];
  }
  // response_format should be OpenAPI 3.0 schema (https://spec.openapis.org/oas/v3.0.3#schema) or JSON Schema (https://json-schema.org/)
  if (response_format) {
    if (response_format.type === "schema") {
      generationConfig.responseMimeType = "application/json";
      generationConfig.responseSchema = response_format.json_schema.schema;
    } else if (response_format.type === "json_schema") {
      generationConfig.responseMimeType = "application/json";
      generationConfig.responseJsonSchema = response_format.json_schema.schema;
    } else {
      GraphAILogger.warn("response_format.type should be `schema` or `json_schema`");
    }
    if (response_format.json_schema.strict !== undefined) {
      GraphAILogger.warn("Gemini does not support 'strict' option, ignoring...");
    }
  }

  const chat = ai.chats.create({
    model: model || "gemini-2.5-flash",
    config: generationConfig,
    history: messagesCopy.map((message) => {
      const role = message.role === "assistant" ? "model" : message.role;
      if (role === "system") {
        // Gemini does not have the concept of system message
        return { role: "user", parts: [{ text: "System Message: " + message.content }] };
      }
      return { role, parts: [{ text: message.content }] };
    }),
  });
  messagesCopy.push(lastMessage);

  if (stream || dataStream) {
    if (dataStream && filterParams && filterParams.streamTokenCallback) {
      filterParams.streamTokenCallback({
        type: "response.created",
        response: {},
      });
    }
    const result = await chat.sendMessageStream({ message: lastMessage.content });

    let finalResponse: GenerateContentResponse | undefined;
    const functionCalls: FunctionCall[] = [];

    for await (const chunk of result) {
      llmMetaDataFirstTokenTime(llmMetaData);
      if (chunk.functionCalls) {
        functionCalls.push(...chunk.functionCalls);
      }
      const chunkText = chunk.text;
      finalResponse = chunk;

      if (filterParams && filterParams.streamTokenCallback && chunkText) {
        if (dataStream) {
          filterParams.streamTokenCallback({
            type: "response.in_progress",
            response: {
              output: [
                {
                  type: "text",
                  text: chunkText,
                },
              ],
            },
          });
        } else {
          filterParams.streamTokenCallback(chunkText);
        }
      }
    }
    if (!finalResponse) {
      return [];
    }

    if (dataStream && filterParams && filterParams.streamTokenCallback) {
      filterParams.streamTokenCallback({
        type: "response.completed",
        response: {},
      });
    }
    llmMetaDataEndTime(llmMetaData);
    return convertOpenAIChatCompletion(finalResponse, functionCalls, messagesCopy, llmMetaData);
  }

  const response: GenerateContentResponse = await chat.sendMessage({
    message: lastMessage.content,
  });

  llmMetaDataEndTime(llmMetaData);
  return convertOpenAIChatCompletion(response, [], messagesCopy, llmMetaData);
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
  source: "https://github.com/receptron/graphai/blob/main/llm_agents/gemini_agent/src/gemini_agent.ts",
  package: "@graphai/gemini_agent",
  license: "MIT",
  stream: true,
  npms: ["@google/genai"],
  environmentVariables: ["GOOGLE_GENAI_API_KEY"],
};

export default geminiAgentInfo;
