"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupDictionaryAgent = void 0;
const graphai_1 = require("graphai");
const agent_utils_1 = require("@graphai/agent_utils");
const lookupDictionaryAgent = async ({ namedInputs, params }) => {
    const { namedKey } = namedInputs;
    (0, graphai_1.assert)((0, agent_utils_1.isNamedInputs)(namedInputs), "lookupDictionaryAgent: namedInputs is UNDEFINED!");
    const result = params[namedKey];
    if (params.throwError && result === undefined) {
        throw new Error(`lookupDictionaryAgent eerror: ${namedKey} is missing`);
    }
    return result;
};
exports.lookupDictionaryAgent = lookupDictionaryAgent;
const exampleParams = {
    openai: {
        model: "gpt4-o",
        temperature: 0.7,
    },
    groq: {
        model: "llama3-8b-8192",
        temperature: 0.6,
    },
    gemini: {
        model: "gemini-2.0-pro-exp-02-05",
        temperature: 0.7,
    },
};
const lookupDictionaryAgentInfo = {
    name: "lookupDictionaryAgent",
    agent: exports.lookupDictionaryAgent,
    mock: exports.lookupDictionaryAgent,
    inputs: {
        type: "object",
        properties: {
            namedKey: {
                type: "string",
                description: "key of params",
            },
        },
        required: ["namedKey"],
    },
    output: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
    },
    samples: [
        {
            inputs: { namedKey: "openai" },
            params: exampleParams,
            result: {
                model: "gpt4-o",
                temperature: 0.7,
            },
        },
        {
            inputs: { namedKey: "gemini" },
            params: exampleParams,
            result: {
                model: "gemini-2.0-pro-exp-02-05",
                temperature: 0.7,
            },
        },
    ],
    description: "Select elements with params",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = lookupDictionaryAgentInfo;
