"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groqAgent = void 0;
const groq_sdk_1 = require("groq-sdk");
const utils_1 = require("../../utils/utils");
const groq = process.env.GROQ_API_KEY ? new groq_sdk_1.Groq({ apiKey: process.env.GROQ_API_KEY }) : undefined;
const groqAgent = async ({ params, inputs }) => {
    (0, utils_1.assert)(groq !== undefined, "The GROQ_API_KEY environment variable is missing.");
    const { verbose, query, system } = params;
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
    if (verbose) {
        console.log(messages);
    }
    const result = await groq.chat.completions.create({
        messages,
        model: params.model,
    });
    return result;
};
exports.groqAgent = groqAgent;
const groqAgentInfo = {
    name: "groqAgent",
    agent: exports.groqAgent,
    mock: exports.groqAgent,
    samples: [],
    description: "Groq Agent",
    category: ["llm"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = groqAgentInfo;
