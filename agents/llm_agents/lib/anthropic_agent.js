"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.anthropicAgent = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const utils_1 = require("./utils");
const anthropicAgent = async ({ params, namedInputs, }) => {
    const { model, system, temperature, max_tokens, prompt, messages } = { ...params, ...namedInputs };
    const userPrompt = (0, utils_1.getMergeValue)(namedInputs, params, "mergeablePrompts", prompt);
    const systemPrompt = (0, utils_1.getMergeValue)(namedInputs, params, "mergeableSystem", system);
    // Notice that we ignore params.system if previous_message exists.
    const messagesCopy = messages ? messages.map((m) => m) : systemPrompt ? [{ role: "system", content: systemPrompt }] : [];
    if (userPrompt) {
        messagesCopy.push({
            role: "user",
            content: userPrompt,
        });
    }
    const anthropic = new sdk_1.default({
        apiKey: process.env["ANTHROPIC_API_KEY"], // This is the default and can be omitted
    });
    const message = await anthropic.messages.create({
        model: model || "claude-3-haiku-20240307", // "claude-3-opus-20240229",
        messages: messagesCopy,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 1024,
        // tools: params.tools,
        // tool_choice: params.tool_choice,
    });
    return { choices: [{ message: { role: message.role, content: message.content[0].text } }] };
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
    // stream: true,
    npms: ["@anthropic-ai/sdk"],
};
exports.default = anthropicAgentInfo;
