"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushAgent = void 0;
const pushAgent = async ({ inputs }) => {
    const array = inputs[0].map((item) => item); // shallow copy
    inputs.forEach((input, index) => {
        if (index > 0) {
            array.push(input);
        }
    });
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
        {
            inputs: [[1, 2], 3, 4, 5],
            params: {},
            result: [1, 2, 3, 4, 5],
        },
        {
            inputs: [[{ apple: 1 }], { lemon: 2 }],
            params: {},
            result: [{ apple: 1 }, { lemon: 2 }],
        },
    ],
    description: "push Agent",
    category: [],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = pushAgentInfo;
