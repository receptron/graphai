"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushAgent = void 0;
const pushAgent = async ({ inputs }) => {
    const array = inputs[0].map((item) => item); // shallow copy
    array.push(inputs[1]);
    return array;
};
exports.pushAgent = pushAgent;
const pushAgentInfo = {
    name: "pushAgent",
    agent: exports.pushAgent,
    mock: exports.pushAgent,
    samples: [
        {
            inputs: [[1, 2], 3],
            params: {},
            result: [1, 2, 3],
        },
    ],
    description: "push Agent",
    category: [],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = pushAgentInfo;
