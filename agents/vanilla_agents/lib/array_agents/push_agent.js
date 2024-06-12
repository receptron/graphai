"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushAgent = void 0;
const graphai_1 = require("graphai");
const pushAgent = async ({ namedInputs }) => {
    (0, graphai_1.assert)(!!namedInputs, "pushAgent: namedInputs is UNDEFINED!");
    const { item } = namedInputs;
    const array = namedInputs.array.map((item) => item); // shallow copy
    array.push(item);
    return array;
};
exports.pushAgent = pushAgent;
const pushAgentInfo = {
    name: "pushAgent",
    agent: exports.pushAgent,
    mock: exports.pushAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array to push an item to",
            },
            item: {
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                description: "the item push into the array",
            },
        },
        required: ["array", "item"],
    },
    output: {
        type: "array",
    },
    samples: [
        {
            inputs: { array: [1, 2], item: 3 },
            params: {},
            result: [1, 2, 3],
        },
        {
            inputs: { array: [{ apple: 1 }], item: { lemon: 2 } },
            params: {},
            result: [{ apple: 1 }, { lemon: 2 }],
        },
    ],
    description: "push Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = pushAgentInfo;
