"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAIMockAgent = exports.openAIFetchAgent = void 0;
const graphai_1 = require("graphai");
const llm_utils_1 = require("@graphai/llm_utils");
const convertOpenAIChatCompletion = (response, messages) => {
    const message = response?.choices[0] && response?.choices[0].message ? response?.choices[0].message : null;
    const text = message && message.content ? message.content : null;
    const functionResponse = message?.tool_calls && message?.tool_calls[0] ? message?.tool_calls[0] : null;
    // const functionId = message?.tool_calls && message?.tool_calls[0] ? message?.tool_calls[0]?.id : null;
    const tool = functionResponse
        ? {
            id: functionResponse.id,
            name: functionResponse?.function?.name,
            arguments: (() => {
                try {
                    return JSON.parse(functionResponse?.function?.arguments);
                }
                catch (__e) {
                    return undefined;
                }
            })(),
        }
        : undefined;
    if (message) {
        messages.push(message);
    }
    return {
        ...response,
        text,
        tool,
        message,
        messages,
    };
};
const openAIFetchAgent = async ({ filterParams, params, namedInputs, }) => {
    const { verbose, system, images, temperature, tools, tool_choice, max_tokens, /* baseURL, */ stream, apiKey, prompt, messages, response_format } = {
        ...params,
        ...namedInputs,
    };
    const userPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeablePrompts", prompt);
    const systemPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeableSystem", system);
    const messagesCopy = (0, llm_utils_1.getMessages)(systemPrompt, messages);
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY key is not set in params. params: {apiKey: 'sk-xxx'}");
    }
    if (userPrompt) {
        messagesCopy.push({
            role: "user",
            content: userPrompt,
        });
    }
    if (images) {
        const image_url = params.model === "gpt-4-vision-preview"
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
                },
            ],
        });
    }
    if (verbose) {
        console.log(messagesCopy);
    }
    const chatParams = {
        model: params.model || "gpt-4o",
        messages: messagesCopy,
        tools,
        tool_choice,
        max_tokens,
        temperature: temperature ?? 0.7,
        stream: !!stream,
        response_format,
    };
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(chatParams),
    });
    if (!stream) {
        if (response.status === 200) {
            const result = await response.json();
            return convertOpenAIChatCompletion(result, messagesCopy);
        }
        throw new Error("OPENAI API Error");
    }
    // streaming
    const reader = response.body?.getReader();
    if (response.status !== 200 || !reader) {
        throw new Error("Request failed");
    }
    const decoder = new TextDecoder("utf-8");
    let done = false;
    const buffer = [];
    let text_buffer = "";
    while (!done) {
        const { done: readDone, value } = await reader.read();
        if (readDone) {
            done = readDone;
            reader.releaseLock();
        }
        else {
            const text = decoder.decode(value, { stream: true });
            text_buffer = text + text_buffer;
            const lines = text_buffer.split(/\n+/);
            const next_buff = [];
            for (const line of lines) {
                try {
                    const json_text = line.replace(/^data:\s*/, "");
                    if (json_text === "[DONE]") {
                        break;
                    }
                    else if (json_text) {
                        const data = JSON.parse(json_text);
                        const token = data.choices[0].delta.content;
                        if (token) {
                            buffer.push(token);
                            if (filterParams && filterParams.streamTokenCallback && token) {
                                filterParams.streamTokenCallback(token);
                            }
                        }
                    }
                }
                catch (__error) {
                    next_buff.push(line);
                }
            }
            text_buffer = next_buff.join("\n");
        }
    }
    return convertOpenAIChatCompletion({
        choices: [
            {
                message: {
                    role: "assistant",
                    content: buffer.join(""),
                    refusal: "",
                },
            },
        ],
    }, messagesCopy);
};
exports.openAIFetchAgent = openAIFetchAgent;
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
const openAIFetchAgentInfo = {
    name: "openAIFetchAgent",
    agent: exports.openAIFetchAgent,
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
            // baseURL: { type: "string" },
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
            // baseURL: { type: "string" },
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
    description: "OpenAI Fetch Agent",
    category: ["llm"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
    stream: true,
    npms: ["openai"],
};
exports.default = openAIFetchAgentInfo;
