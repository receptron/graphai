"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleAgent = void 0;
const consoleAgent = async ({ namedInputs }) => {
    const { text } = namedInputs;
    console.info(text);
    return {
        text,
    };
};
exports.consoleAgent = consoleAgent;
const consoleAgentInfo = {
    name: "consoleAgent",
    agent: exports.consoleAgent,
    mock: exports.consoleAgent,
    inputs: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "text",
            },
        },
    },
    output: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "text",
            },
        },
    },
    samples: [
        {
            inputs: { text: "hello" },
            params: {},
            result: { text: "hello" },
        },
    ],
    description: "Just text to console.info",
    category: ["string"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/console_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = consoleAgentInfo;
