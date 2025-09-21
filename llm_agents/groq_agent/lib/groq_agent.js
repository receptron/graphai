"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groqAgent = void 0;
const graphai_1 = require("graphai");
const groq_sdk_1 = require("groq-sdk");
const llm_utils_1 = require("@graphai/llm_utils");
// https://github.com/groq/groq-typescript
//
// This agent takes two optional inputs, and following parameters.
// inputs:
// - [0]: query string (typically from the user), optional
// - [1]: array of messages from previous conversation, optional
//
// params:
// - model: LLM model (llama-3.1-8b-instant, llama-3.3-70b-versatile, meta-llama/llama-guard-4-12b), required.
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
const convertOpenAIChatCompletion = (response, messages, llmMetaData) => {
    const message = response?.choices[0] && response?.choices[0].message ? response?.choices[0].message : null;
    const text = message && message.content ? message.content : null;
    // const functionResponse = message?.tool_calls && message?.tool_calls[0] ? message?.tool_calls[0] : null;
    const functionResponses = message?.tool_calls && message?.tool_calls.length > 0 ? message?.tool_calls : [];
    const tool_calls = functionResponses.map((functionResponse) => {
        return {
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
        };
    });
    const tool = tool_calls[0] ? tool_calls[0] : undefined;
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
        metadata: (0, llm_utils_1.convertMeta)(llmMetaData),
    };
};
const groqAgent = async ({ params, namedInputs, filterParams, config }) => {
    const { verbose, system, tools, tool_choice, max_tokens, temperature, prompt, messages } = { ...params, ...namedInputs };
    const { apiKey, stream, dataStream, forWeb, model } = {
        ...params,
        ...(config || {}),
    };
    const key = apiKey ?? (process !== undefined ? process.env.GROQ_API_KEY : undefined);
    (0, graphai_1.assert)(key !== undefined, "The GROQ_API_KEY environment variable adn apiKey is missing.");
    const groq = new groq_sdk_1.Groq({ apiKey, dangerouslyAllowBrowser: !!forWeb });
    const llmMetaData = (0, llm_utils_1.initLLMMetaData)();
    const userPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeablePrompts", prompt);
    const systemPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeableSystem", system);
    // Notice that we ignore params.system if previous_message exists.
    const messagesCopy = (0, llm_utils_1.getMessages)(systemPrompt, messages);
    if (userPrompt) {
        messagesCopy.push({
            role: "user",
            content: userPrompt,
        });
    }
    if (verbose) {
        console.log(messagesCopy);
    }
    const streamOption = {
        messages: messagesCopy,
        model,
        temperature: temperature ?? 0.7,
        stream: true,
    };
    const nonStreamOption = {
        messages: messagesCopy,
        model,
        temperature: temperature ?? 0.7,
    };
    const options = stream || dataStream ? streamOption : nonStreamOption;
    if (max_tokens) {
        options.max_tokens = max_tokens;
    }
    if (tools) {
        options.tools = tools;
        options.tool_choice = tool_choice ?? "auto";
    }
    if (!options.stream) {
        const result = await groq.chat.completions.create(options);
        (0, llm_utils_1.llmMetaDataEndTime)(llmMetaData);
        return convertOpenAIChatCompletion(result, messagesCopy, llmMetaData);
    }
    // streaming
    const pipe = await groq.chat.completions.create(options);
    let lastMessage = null;
    const contents = [];
    if (dataStream && filterParams && filterParams.streamTokenCallback) {
        filterParams.streamTokenCallback({
            type: "response.created",
            response: {},
        });
    }
    for await (const _message of pipe) {
        (0, llm_utils_1.llmMetaDataFirstTokenTime)(llmMetaData);
        const token = _message.choices[0].delta.content;
        if (token) {
            if (filterParams && filterParams.streamTokenCallback) {
                if (dataStream) {
                    filterParams.streamTokenCallback({
                        type: "response.in_progress",
                        response: {
                            output: [
                                {
                                    type: "text",
                                    text: token,
                                },
                            ],
                        },
                    });
                }
                else {
                    filterParams.streamTokenCallback(token);
                }
            }
            contents.push(token);
        }
        lastMessage = _message;
    }
    if (dataStream && filterParams && filterParams.streamTokenCallback) {
        filterParams.streamTokenCallback({
            type: "response.completed",
            response: {},
        });
    }
    const text = contents.join("");
    const message = { role: "assistant", content: text };
    if (lastMessage) {
        lastMessage.choices[0]["message"] = message;
    }
    // maybe not suppor tool when streaming
    messagesCopy.push(message);
    (0, llm_utils_1.llmMetaDataEndTime)(llmMetaData);
    return {
        ...lastMessage,
        text,
        message,
        messages: messagesCopy,
        metadata: (0, llm_utils_1.convertMeta)(llmMetaData),
    };
};
exports.groqAgent = groqAgent;
const groqAgentInfo = {
    name: "groqAgent",
    agent: exports.groqAgent,
    mock: exports.groqAgent,
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
    source: "https://github.com/receptron/graphai/blob/main/agents/sleeper_agents/src/sleep_and_merge_agent.ts",
    package: "@graphai/groq_agent",
    license: "MIT",
    stream: true,
    npms: ["groq-sdk"],
    environmentVariables: ["GROQ_API_KEY"],
};
exports.default = groqAgentInfo;
