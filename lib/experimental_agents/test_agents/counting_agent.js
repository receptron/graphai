"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countingAgent = void 0;
const countingAgent = async ({ params }) => {
    return {
        list: new Array(params.count).fill(undefined).map((_, i) => {
            return i;
        }),
    };
};
exports.countingAgent = countingAgent;
// for test and document
const countingAgentInfo = {
    name: "countingAgent",
    agent: exports.countingAgent,
    mock: exports.countingAgent,
    samples: [
        {
            inputs: [],
            params: { count: 4 },
            result: { list: [0, 1, 2, 3] },
        },
    ],
    description: "Counting agent",
    category: [],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = countingAgentInfo;
