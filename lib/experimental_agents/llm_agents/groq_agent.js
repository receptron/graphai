"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gloqAgent = void 0;
const groq_sdk_1 = require("groq-sdk");
const utils_1 = require("../../utils/utils");
const groq = process.env.GROQ_API_KEY ? new groq_sdk_1.Groq({ apiKey: process.env.GROQ_API_KEY }) : undefined;
const gloqAgent = async ({ params, inputs }) => {
    (0, utils_1.assert)(groq !== undefined, "The GROQ_API_KEY environment variable is missing.");
    const query = params?.query ? [params.query] : [];
    const content = query.concat(inputs).join("\n");
    const messages = params?.system ? [{ role: "system", content: params.system }] : [];
    messages.push({
        role: "user",
        content,
    });
    const result = await groq.chat.completions.create({
        messages,
        model: params.model,
    });
    return result;
};
exports.gloqAgent = gloqAgent;
const gloqAgentInfo = {
    name: "gloqAgent",
    agent: exports.gloqAgent,
    mock: exports.gloqAgent,
    samples: [],
    description: "Groq Agent",
    category: ["llm"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = gloqAgentInfo;
