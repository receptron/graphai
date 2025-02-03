"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.anthropicAgent = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const llm_utils_1 = require("@graphai/llm_utils");
const convToolCall = (tool_call) => {
    const { id, name, input } = tool_call;
    return { id, name, arguments: input };
};
// https://docs.anthropic.com/ja/api/messages
const convertOpenAIChatCompletion = (response, messages) => {
    // SDK bug https://github.com/anthropics/anthropic-sdk-typescript/issues/432
    const text = response.content[0].text;
    const functionResponses = response.content.filter((content) => content.type === "tool_use") ?? [];
    const tool_calls = functionResponses.map(convToolCall);
    const tool = tool_calls[0] ? tool_calls[0] : undefined;
    const message = { role: response.role, content: text };
    messages.push(message);
    return { ...response, choices: [{ message }], text, tool, tool_calls, message, messages };
};
const anthropicAgent = async ({ params, namedInputs, filterParams, config, }) => {
    const { verbose, system, temperature, tools, tool_choice, max_tokens, prompt, messages } = { ...params, ...namedInputs };
    const { apiKey, stream, forWeb, model } = {
        ...params,
        ...(config || {}),
    };
    const userPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeablePrompts", prompt);
    const systemPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeableSystem", system);
    const messagesCopy = messages ? messages.map((m) => m) : [];
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
        model: model ?? "claude-3-5-sonnet-latest",
        messages: messagesCopy,
        tools: anthropic_tools,
        tool_choice,
        system: systemPrompt,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 1024,
    };
    if (!stream) {
        const messageResponse = await anthropic.messages.create(chatParams);
        return convertOpenAIChatCompletion(messageResponse, messagesCopy);
    }
    const chatStream = await anthropic.messages.create({
        ...chatParams,
        stream: true,
    });
    const contents = [];
    const partials = [];
    let streamResponse = null;
    for await (const messageStreamEvent of chatStream) {
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
                filterParams.streamTokenCallback(token);
            }
        }
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
    return convertOpenAIChatCompletion(streamResponse, messagesCopy);
    /*
    
    const content = contents.join("");
    const message = { role: "assistant" as const, content: content };
    messagesCopy.push(message);
    return { choices: [{ message }], text: content, message, messages: messagesCopy };
    */
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
    license: "MIT",
    stream: true,
    environmentVariables: ["ANTHROPIC_API_KEY"],
    npms: ["@anthropic-ai/sdk"],
};
exports.default = anthropicAgentInfo;
