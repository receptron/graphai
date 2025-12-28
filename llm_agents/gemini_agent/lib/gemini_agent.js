"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiAgent = void 0;
const graphai_1 = require("graphai");
const generative_ai_1 = require("@google/generative-ai");
const llm_utils_1 = require("@graphai/llm_utils");
const convertOpenAIChatCompletion = (response, messages, llmMetaData) => {
    const text = response.text();
    const message = { role: "assistant", content: text };
    // [":llm.choices.$0.message.tool_calls.$0.function.arguments"],
    const calls = response.functionCalls();
    if (calls) {
        message.tool_calls = calls.map((call) => {
            return { function: { name: call.name, arguments: JSON.stringify(call.args) } };
        });
    }
    const tool_calls = calls
        ? calls.map((call) => {
            return {
                id: "dummy",
                name: call.name,
                arguments: call.args,
            };
        })
        : [];
    const tool = tool_calls && tool_calls[0] ? tool_calls[0] : undefined;
    messages.push(message);
    const usageMetadata = response.usageMetadata;
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
        metadata: (0, llm_utils_1.convertMeta)(llmMetaData),
        usage: usageMetadata ? { ...usageMetadata, ...extraUsage } : undefined,
    };
};
const geminiAgent = async ({ params, namedInputs, config, filterParams }) => {
    const { system, temperature, tools, max_tokens, prompt, messages /* response_format */ } = { ...params, ...namedInputs };
    const { apiKey, stream, dataStream, model } = {
        ...params,
        ...(config || {}),
    };
    const llmMetaData = (0, llm_utils_1.initLLMMetaData)();
    const userPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeablePrompts", prompt);
    const systemPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeableSystem", system);
    const messagesCopy = (0, llm_utils_1.getMessages)(systemPrompt, messages);
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
    (0, graphai_1.assert)(!!key, "GOOGLE_GENAI_API_KEY is missing in the environment.");
    const genAI = new generative_ai_1.GoogleGenerativeAI(key);
    const safetySettings = [
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
    ];
    const modelParams = {
        model: model || "gemini-2.5-flash",
        safetySettings,
    };
    /*
    if (response_format) {
      modelParams.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: response_format,
      };
    }
    */
    if (tools) {
        const functions = tools.map((tool) => {
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
    messagesCopy.push(lastMessage);
    if (stream || dataStream) {
        if (dataStream && filterParams && filterParams.streamTokenCallback) {
            filterParams.streamTokenCallback({
                type: "response.created",
                response: {},
            });
        }
        const result = await chat.sendMessageStream(lastMessage.content);
        for await (const chunk of result.stream) {
            (0, llm_utils_1.llmMetaDataFirstTokenTime)(llmMetaData);
            const chunkText = chunk.text();
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
                }
                else {
                    filterParams.streamTokenCallback(chunkText);
                }
            }
        }
        const response = await result.response;
        if (dataStream && filterParams && filterParams.streamTokenCallback) {
            filterParams.streamTokenCallback({
                type: "response.completed",
                response: {},
            });
        }
        (0, llm_utils_1.llmMetaDataEndTime)(llmMetaData);
        return convertOpenAIChatCompletion(response, messagesCopy, llmMetaData);
    }
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    (0, llm_utils_1.llmMetaDataEndTime)(llmMetaData);
    return convertOpenAIChatCompletion(response, messagesCopy, llmMetaData);
};
exports.geminiAgent = geminiAgent;
const geminiAgentInfo = {
    name: "geminiAgent",
    agent: exports.geminiAgent,
    mock: exports.geminiAgent,
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
    npms: ["@anthropic-ai/sdk"],
    environmentVariables: ["GOOGLE_GENAI_API_KEY"],
};
exports.default = geminiAgentInfo;
