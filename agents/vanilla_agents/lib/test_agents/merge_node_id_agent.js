"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeNodeIdAgent = void 0;
const agent_utils_1 = require("@graphai/agent_utils");
const mergeNodeIdAgent = async ({ debugInfo: { nodeId }, inputs, namedInputs, }) => {
    // console.log("executing", nodeId);
    const dataSet = (0, agent_utils_1.isNamedInputs)(namedInputs) ? namedInputs.array : inputs;
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
    samples: [
        {
            inputs: [{ message: "hello" }],
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
    license: "MIT",
};
exports.default = mergeNodeIdAgentInfo;
