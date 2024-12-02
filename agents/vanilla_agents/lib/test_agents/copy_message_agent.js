"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyMessageAgent = void 0;
const copyMessageAgent = async ({ params }) => {
    return {
        messages: new Array(params.count).fill(undefined).map(() => {
            return params.message;
        }),
    };
};
exports.copyMessageAgent = copyMessageAgent;
// for test and document
const copyMessageAgentInfo = {
    name: "copyMessageAgent",
    agent: exports.copyMessageAgent,
    mock: exports.copyMessageAgent,
    samples: [
        {
            inputs: {},
            params: { count: 4, message: "hello" },
            result: { messages: ["hello", "hello", "hello", "hello"] },
        },
    ],
    description: "CopyMessage agent",
    category: ["test"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = copyMessageAgentInfo;
