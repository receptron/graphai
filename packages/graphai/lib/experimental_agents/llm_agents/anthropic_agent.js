"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.anthropicAgent = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const anthropicAgent = async ({ params, inputs }) => {
    const { query, system, temperature, max_tokens } = params;
    const [input_query, previous_messages] = inputs;
    // Notice that we ignore params.system if previous_message exists.
    const messagesProvided = previous_messages && Array.isArray(previous_messages) ? previous_messages : system ? [{ role: "system", content: system }] : [];
    const messages = messagesProvided.map((m) => m); // sharrow copy
    const content = (query ? [query] : []).concat(input_query ? [input_query] : []).join("\n");
    if (content) {
        messages.push({
            role: "user",
            content,
        });
    }
    const anthropic = new sdk_1.default({
        apiKey: process.env["ANTHROPIC_API_KEY"], // This is the default and can be omitted
    });
    return await anthropic.messages.create({
        model: params.model || "claude-3-haiku-20240307", // "claude-3-opus-20240229",
        messages,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 1024,
        // tools: params.tools,
        // tool_choice: params.tool_choice,
    });
};
exports.anthropicAgent = anthropicAgent;
const anthropicAgentInfo = {
    name: "anthropicAgent",
    agent: exports.anthropicAgent,
    mock: exports.anthropicAgent,
    samples: [],
    skipTest: true,
    description: "Anthropic Agent",
    category: ["llm"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
    // stream: true,
    npms: ["@anthropic-ai/sdk"],
};
exports.default = anthropicAgentInfo;
