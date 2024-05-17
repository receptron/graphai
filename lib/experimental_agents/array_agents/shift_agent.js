"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftAgent = void 0;
const shiftAgent = async (context) => {
    const { inputs } = context;
    const array = inputs[0].map((item) => item); // shallow copy
    const item = array.shift();
    return { array, item };
};
exports.shiftAgent = shiftAgent;
const shiftAgentInfo = {
    name: "shiftAgent",
    agent: exports.shiftAgent,
    mock: exports.shiftAgent,
    samples: [
        {
            inputs: [[1, 2, 3]],
            params: {},
            result: {
                array: [2, 3],
                item: 1,
            },
        },
        {
            inputs: [["a", "b", "c"]],
            params: {},
            result: {
                array: ["b", "c"],
                item: "a",
            },
        },
    ],
    description: "shift Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = shiftAgentInfo;
