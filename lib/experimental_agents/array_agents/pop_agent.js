"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.popAgent = void 0;
const popAgent = async (context) => {
    const { inputs } = context;
    const array = inputs[0].map((item) => item); // shallow copy
    const item = array.pop();
    return { array, item };
};
exports.popAgent = popAgent;
const popAgentInfo = {
    name: "popAgent",
    agent: exports.popAgent,
    mock: exports.popAgent,
    samples: [
        {
            inputs: [[1, 2, 3]],
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
        {
            inputs: [["a", "b", "c"]],
            params: {},
            result: {
                array: ["a", "b"],
                item: "c",
            },
        },
        {
            inputs: [
                [1, 2, 3],
                ["a", "b", "c"],
            ],
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
    ],
    description: "Pop Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = popAgentInfo;
