"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiAgent = void 0;
const generative_ai_1 = require("@google/generative-ai");
const utils_1 = require("graphai/lib/utils/utils");
const geminiAgent = async ({ params, inputs }) => {
    const { query, system, temperature, max_tokens, tools } = params;
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
    const lastMessage = messages.pop();
    const key = process.env["GOOGLE_GENAI_API_KEY"];
    (0, utils_1.assert)(!!key, "GOOGLE_GENAI_API_KEY is missing in the environment.");
    const genAI = new generative_ai_1.GoogleGenerativeAI(key);
    const safetySettings = [
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
    ];
    const modelParams = {
        model: params.model ?? "gemini-pro",
        safetySettings,
    };
    if (tools) {
        const functions = tools.map((tool) => {
            return tool.function;
        });
        modelParams.tools = [{ functionDeclarations: functions }];
    }
    const model = genAI.getGenerativeModel(modelParams);
    const generationConfig = {
        maxOutputTokens: max_tokens,
        temperature,
        // topP: 0.1,
        // topK: 16,
    };
    const chat = model.startChat({
        history: messages.map((message) => {
            const role = message.role === "assistant" ? "model" : message.role;
            if (role === "system") {
                // Gemini does not have the concept of system message
                return { role: "user", parts: [{ text: "System Message: " + message.content }] };
            }
            return { role, parts: [{ text: message.content }] };
        }),
        generationConfig,
    });
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    const text = response.text();
    const message = { role: "assistant", content: text };
    // [":llm.choices.$0.message.tool_calls.$0.function.arguments"],
    const calls = result.response.functionCalls();
    if (calls) {
        message.tool_calls = calls.map((call) => {
            return { function: { name: call.name, arguments: JSON.stringify(call.args) } };
        });
    }
    return { choices: [{ message }] };
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
