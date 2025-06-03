"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeNodeIdAgent = void 0;
const agent_utils_1 = require("@graphai/agent_utils");
const mergeNodeIdAgent = async ({ debugInfo: { nodeId }, namedInputs, }) => {
    (0, agent_utils_1.arrayValidate)("mergeNodeIdAgent", namedInputs);
    const dataSet = namedInputs.array;
    return dataSet.reduce((tmp, input) => {
        return { ...tmp, ...input };
    }, { [nodeId]: "hello" });
};
exports.mergeNodeIdAgent = mergeNodeIdAgent;
// for test and document
const mergeNodeIdAgentInfo = {
    name: "mergeNodeIdAgent",
    agent: exports.mergeNodeIdAgent,
    mock: exports.mergeNodeIdAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "An array of objects to be merged together into a single object. Each object represents a partial result or state.",
                items: {
                    type: "object",
                    description: "A single object containing key-value pairs to merge.",
                },
            },
        },
        required: ["array"],
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "This agent does not take any parameters. The object must be empty.",
        properties: {},
        additionalProperties: false,
    },
    samples: [
        {
            inputs: { array: [{ message: "hello" }] },
            params: {},
            result: {
                message: "hello",
                test: "hello",
            },
        },
    ],
    description: "merge node id agent",
    category: ["test"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/merge_node_id_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = mergeNodeIdAgentInfo;
