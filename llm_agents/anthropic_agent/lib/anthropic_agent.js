"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.anthropicAgent = exports.convOpenAIToolsToAnthropicToolMessage = exports.system_with_response_format = exports.anthoropicTool2OpenAITool = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const llm_utils_1 = require("@graphai/llm_utils");
const convToolCall = (tool_call) => {
    const { id, name, input } = tool_call;
    return { id, name, arguments: input };
};
const anthoropicTool2OpenAITool = (response) => {
    const contentText = response.content
        .filter((c) => c.type === "text")
        .map((b) => b.text ?? "")
        .join(" ");
    const tool_calls = response.content
        .filter((c) => c.type === "tool_use")
        .map((content) => {
        const { id, name, input } = content;
        return {
            id,
            name,
            arguments: input,
        };
    });
    if (tool_calls.length > 0) {
        return {
            role: response.role,
            content: contentText,
            tool_calls,
        };
    }
    return { role: response.role, content: contentText };
};
exports.anthoropicTool2OpenAITool = anthoropicTool2OpenAITool;
// https://docs.anthropic.com/ja/api/messages
const convertOpenAIChatCompletion = (response, messages, llmMetaData, maybeResponseFormat) => {
    (0, llm_utils_1.llmMetaDataEndTime)(llmMetaData);
    // SDK bug https://github.com/anthropics/anthropic-sdk-typescript/issues/432
    const text = response.content[0].text;
    const functionResponses = response.content.filter((content) => content.type === "tool_use") ?? [];
    const tool_calls = functionResponses.map(convToolCall);
    const tool = tool_calls[0] ? tool_calls[0] : undefined;
    const message = (0, exports.anthoropicTool2OpenAITool)(response);
    const responseFormat = (() => {
        if (maybeResponseFormat && text) {
            const parsed = JSON.parse(text);
            if (typeof parsed === "object" && parsed !== null) {
                return parsed;
            }
        }
        return null;
    })();
    const { usage } = response;
    const extraUsage = usage
        ? {
            prompt_tokens: usage.input_tokens,
            completion_tokens: usage.output_tokens,
            total_tokens: usage.input_tokens + usage.output_tokens,
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
        responseFormat,
        usage: { ...usage, ...extraUsage },
    };
};
const system_with_response_format = (system, response_format) => {
    if (response_format) {
        if (system) {
            return [
                "Please return the following json object for the specified content.",
                JSON.stringify(response_format, null, 2),
                "",
                "<description>",
                system,
                "</description>",
            ].join("\n");
        }
        return ["Please return the following json object for the specified content.", JSON.stringify(response_format, null, 2)].join("\n");
    }
    return system;
};
exports.system_with_response_format = system_with_response_format;
const convOpenAIToolsToAnthropicToolMessage = (messages) => {
    return messages.reduce((tmp, message) => {
        if (message.role === "assistant" && message.tool_calls) {
            const content = [
                {
                    type: "text",
                    text: message.content,
                },
            ];
            message.tool_calls.forEach((tool) => {
                const { id, name, arguments: args } = tool;
                content.push({
                    type: "tool_use",
                    id,
                    name,
                    input: args,
                });
            });
            tmp.push({
                role: "assistant",
                content,
            });
        }
        else if (message.role === "tool") {
            const last = tmp[tmp.length - 1];
            if (last?.role === "user" && last?.content?.[0]?.type === "tool_result") {
                tmp[tmp.length - 1].content.push({
                    type: "tool_result",
                    tool_use_id: message.tool_call_id,
                    content: message.content,
                });
            }
            else {
                tmp.push({
                    role: "user",
                    content: [
                        {
                            type: "tool_result",
                            tool_use_id: message.tool_call_id,
                            content: message.content,
                        },
                    ],
                });
            }
        }
        else {
            tmp.push(message);
        }
        return tmp;
    }, []);
};
exports.convOpenAIToolsToAnthropicToolMessage = convOpenAIToolsToAnthropicToolMessage;
const anthropicAgent = async ({ params, namedInputs, filterParams, config, }) => {
    const { verbose, system, temperature, tools, tool_choice, max_tokens, prompt, messages, response_format } = { ...params, ...namedInputs };
    const { apiKey, stream, dataStream, forWeb, model } = {
        ...params,
        ...(config || {}),
    };
    const llmMetaData = (0, llm_utils_1.initLLMMetaData)();
    const userPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeablePrompts", prompt);
    const systemPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeableSystem", (0, exports.system_with_response_format)(system, response_format));
    const messagesCopy = messages ? messages.map((m) => m) : [];
    const messageSystemPrompt = messagesCopy[0] && messagesCopy[0].role === "system" ? messagesCopy[0].content : "";
    if (userPrompt) {
        messagesCopy.push({
            role: "user",
            content: userPrompt,
        });
    }
    if (verbose) {
        console.log(messagesCopy);
    }
    const anthropic_tools = tools && tools.length > 0
        ? tools.map((tool) => {
            const { function: func } = tool;
            const { name, description, parameters } = func;
            return {
                name,
                description,
                input_schema: parameters,
            };
        })
        : undefined;
    const anthropic = new sdk_1.default({ apiKey, dangerouslyAllowBrowser: !!forWeb });
    const chatParams = {
        model: model || "claude-3-7-sonnet-20250219",
        messages: (0, exports.convOpenAIToolsToAnthropicToolMessage)(messagesCopy.filter((m) => m.role !== "system")),
        tools: anthropic_tools,
        tool_choice,
        system: systemPrompt || messageSystemPrompt,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 8192,
    };
    if (!stream && !dataStream) {
        const messageResponse = await anthropic.messages.create(chatParams);
        return convertOpenAIChatCompletion(messageResponse, messagesCopy, llmMetaData, !!response_format);
    }
    const chatStream = await anthropic.messages.create({
        ...chatParams,
        stream: true,
    });
    const contents = [];
    const partials = [];
    let streamResponse = null;
    if (dataStream && filterParams && filterParams.streamTokenCallback) {
        filterParams.streamTokenCallback({
            type: "response.created",
            response: {},
        });
    }
    for await (const messageStreamEvent of chatStream) {
        (0, llm_utils_1.llmMetaDataFirstTokenTime)(llmMetaData);
        if (messageStreamEvent.type === "message_start") {
            streamResponse = messageStreamEvent.message;
        }
        if (messageStreamEvent.type === "content_block_start") {
            if (streamResponse) {
                streamResponse.content.push(messageStreamEvent.content_block);
            }
            partials.push("");
        }
        if (messageStreamEvent.type === "content_block_delta") {
            const { index, delta } = messageStreamEvent;
            if (delta.type === "input_json_delta") {
                partials[index] = partials[index] + delta.partial_json;
            }
            if (delta.type === "text_delta") {
                partials[index] = partials[index] + delta.text;
            }
        }
        if (messageStreamEvent.type === "content_block_delta" && messageStreamEvent.delta.type === "text_delta") {
            const token = messageStreamEvent.delta.text;
            contents.push(token);
            if (filterParams && filterParams.streamTokenCallback && token) {
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
        }
    }
    if (dataStream && filterParams && filterParams.streamTokenCallback) {
        filterParams.streamTokenCallback({
            type: "response.completed",
            response: {},
        });
    }
    if (streamResponse === null) {
        throw new Error("Anthoropic no response");
    }
    partials.forEach((partial, index) => {
        if (streamResponse.content[index].type === "text") {
            streamResponse.content[index].text = partial;
        }
        if (streamResponse.content[index].type === "tool_use") {
            streamResponse.content[index].input = JSON.parse(partial);
        }
    });
    return convertOpenAIChatCompletion(streamResponse, messagesCopy, llmMetaData, !!response_format);
};
exports.anthropicAgent = anthropicAgent;
const anthropicAgentInfo = {
    name: "anthropicAgent",
    agent: exports.anthropicAgent,
    mock: exports.anthropicAgent,
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
    source: "https://github.com/receptron/graphai/blob/main/llm_agents/anthropic_agent/src/anthropic_agent.ts",
    package: "@graphai/anthropic_agent",
    license: "MIT",
    stream: true,
    environmentVariables: ["ANTHROPIC_API_KEY"],
    npms: ["@anthropic-ai/sdk"],
};
exports.default = anthropicAgentInfo;
