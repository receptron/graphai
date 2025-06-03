"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeObjectAgent = void 0;
const graphai_1 = require("graphai");
const agent_utils_1 = require("@graphai/agent_utils");
const mergeObjectAgent = async ({ namedInputs }) => {
    (0, graphai_1.assert)((0, agent_utils_1.isNamedInputs)(namedInputs), "mergeObjectAgent: namedInputs is UNDEFINED!");
    const { items } = namedInputs;
    (0, graphai_1.assert)(items !== undefined && Array.isArray(items), "mergeObjectAgent: namedInputs.items is not array!");
    return Object.assign({}, ...items);
};
exports.mergeObjectAgent = mergeObjectAgent;
const mergeObjectAgentInfo = {
    name: "mergeObjectAgent",
    agent: exports.mergeObjectAgent,
    mock: exports.mergeObjectAgent,
    inputs: {
        type: "object",
        properties: {
            items: {
                type: "array",
                description: "An array of objects whose key-value pairs will be merged into a single object. Later objects override earlier ones on key conflict.",
                items: {
                    type: "object",
                    description: "An individual object contributing to the merged result.",
                },
            },
        },
        required: ["items"],
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "This agent does not take any parameters. The object must be empty.",
        properties: {},
        additionalProperties: false,
    },
    output: {
        anyOf: { type: "object" },
    },
    samples: [
        {
            inputs: { items: [{ color: "red" }, { model: "Model 3" }] },
            params: {},
            result: { color: "red", model: "Model 3" },
        },
    ],
    description: "Returns namedInputs",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/merge_objects_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = mergeObjectAgentInfo;
