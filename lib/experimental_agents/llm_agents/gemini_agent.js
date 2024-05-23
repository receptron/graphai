"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiAgent = void 0;
const generative_ai_1 = require("@google/generative-ai");
const utils_1 = require("../../utils/utils");
const geminiAgent = async ({ params, inputs }) => {
    const { query, system, temperature, max_tokens } = params;
    const [input_query, previous_messages] = inputs;
    // Notice that we ignore params.system if previous_message exists.
    const messages = previous_messages && Array.isArray(previous_messages) ? previous_messages : system ? [{ role: "system", content: system }] : [];
    const content = (query ? [query] : []).concat(input_query ? [input_query] : []).join("\n");
    if (content) {
        messages.push({
            role: "user",
            content,
        });
    }
    const key = process.env["GOOGLE_GENAI_API_KEY"];
    (0, utils_1.assert)(!!key, "GOOGLE_GENAI_API_KEY is missing in the environment.");
    const genAI = new generative_ai_1.GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
        model: params.model ?? "gemini-pro",
    });
    const generationConfig = {
        maxOutputTokens: max_tokens,
        temperature,
        // topP: 0.1,
        // topK: 16,
    };
    const chat = model.startChat({
        history: [],
        generationConfig,
    });
    const result = await chat.sendMessage(content);
    const response = await result.response;
    const text = response.text();
    return text;
};
exports.geminiAgent = geminiAgent;
const geminiAgentInfo = {
    name: "geminiAgent",
    agent: exports.geminiAgent,
    mock: exports.geminiAgent,
    samples: [],
    skipTest: true,
    description: "Gemini Agent",
    category: ["llm"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
    // stream: true,
    npms: ["@anthropic-ai/sdk"],
};
exports.default = geminiAgentInfo;
