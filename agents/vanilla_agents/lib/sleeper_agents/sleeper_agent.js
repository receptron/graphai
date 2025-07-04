"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleeperAgent = void 0;
const graphai_1 = require("graphai");
const sleeperAgent = async ({ params, namedInputs }) => {
    await (0, graphai_1.sleep)(params?.duration ?? 10);
    return namedInputs;
};
exports.sleeperAgent = sleeperAgent;
const sleeperAgentInfo = {
    name: "sleeperAgent",
    agent: exports.sleeperAgent,
    mock: exports.sleeperAgent,
    inputs: {
        type: "object",
        description: "Arbitrary input data. This agent does not modify it and returns it unchanged after a delay.",
        additionalProperties: true,
    },
    params: {
        type: "object",
        properties: {
            duration: {
                type: "number",
                description: "Optional duration in milliseconds to pause execution before returning the input. Defaults to 10ms.",
            },
        },
        additionalProperties: false,
    },
    output: {
        type: "object",
        description: "Returns the same object passed as 'inputs', unchanged.",
        additionalProperties: true,
    },
    samples: [
        {
            inputs: {},
            params: { duration: 1 },
            result: {},
        },
        {
            inputs: { array: [{ a: 1 }, { b: 2 }] },
            params: { duration: 1 },
            result: {
                array: [{ a: 1 }, { b: 2 }],
            },
        },
    ],
    description: "sleeper Agent for test and debug",
    category: ["sleeper"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/sleeper_agents/sleeper_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = sleeperAgentInfo;
