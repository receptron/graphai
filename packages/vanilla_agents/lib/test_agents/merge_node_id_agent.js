"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeNodeIdAgent = void 0;
const mergeNodeIdAgent = async ({ debugInfo: { nodeId }, inputs, }) => {
    // console.log("executing", nodeId);
    return inputs.reduce((tmp, input) => {
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
