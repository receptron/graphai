"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAIMockAgent = exports.openAIAgent = exports.getMergeValue = exports.flatString = void 0;
const openai_1 = __importDefault(require("openai"));
const graphai_1 = require("graphai");
// export for test
const flatString = (input) => {
    return Array.isArray(input) ? input.filter((a) => a).join("\n") : input ?? "";
};
exports.flatString = flatString;
// export for test
const getMergeValue = (namedInputs, params, key, values) => {
    const inputValue = namedInputs[key];
    const paramsValue = params[key];
    return inputValue || paramsValue ? [(0, exports.flatString)(inputValue), (0, exports.flatString)(paramsValue)].filter((a) => a).join("\n") : (0, exports.flatString)(values);
};
exports.getMergeValue = getMergeValue;
const openAIAgent = async ({ filterParams, params, namedInputs, }) => {
    const { verbose, system, temperature, tools, tool_choice, max_tokens, baseURL, apiKey, stream, prompt, messages, forWeb } = { ...params, ...namedInputs };
    const userPrompt = (0, exports.getMergeValue)(namedInputs, params, "mergeablePrompts", prompt);
    const systemPrompt = (0, exports.getMergeValue)(namedInputs, params, "mergeableSystem", system);
    // Notice that we ignore params.system if previous_message exists.
    const messagesCopy = messages ? messages.map((m) => m) : systemPrompt ? [{ role: "system", content: systemPrompt }] : [];
    if (prompt) {
        messagesCopy.push({
            role: "user",
            content: userPrompt,
        });
    }
    if (verbose) {
        console.log(messagesCopy);
    }
    const openai = new openai_1.default({ apiKey, baseURL, dangerouslyAllowBrowser: !!forWeb });
    const chatParams = {
        model: params.model || "gpt-3.5-turbo",
        messages: messagesCopy,
        tools,
        tool_choice,
        max_tokens,
        temperature: temperature ?? 0.7,
    };
    if (!stream) {
        return await openai.chat.completions.create(chatParams);
    }
    const chatStream = await openai.beta.chat.completions.stream({
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
exports.openAIAgent = openAIAgent;
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
const openAIMockAgent = async ({ filterParams }) => {
    for await (const token of input_sample.split("")) {
        if (filterParams && filterParams.streamTokenCallback && token) {
            await (0, graphai_1.sleep)(100);
            filterParams.streamTokenCallback(token);
        }
    }
    return result_sample;
};
exports.openAIMockAgent = openAIMockAgent;
const openaiAgentInfo = {
    name: "openAIAgent",
    agent: exports.openAIAgent,
    mock: exports.openAIMockAgent,
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
};
exports.default = openaiAgentInfo;
