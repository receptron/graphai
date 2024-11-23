"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftAgent = void 0;
const common_1 = require("./common");
const shiftAgent = async ({ namedInputs }) => {
    (0, common_1.arrayValidate)("shiftAgent", namedInputs);
    const array = namedInputs.array.map((item) => item); // shallow copy
    const item = array.shift();
    return { array, item };
};
exports.shiftAgent = shiftAgent;
const shiftAgentInfo = {
    name: "shiftAgent",
    agent: exports.shiftAgent,
    mock: exports.shiftAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array to shift an item from",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            item: {
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                description: "the item shifted from the array",
            },
            array: {
                type: "array",
                description: "the remaining array",
            },
        },
    },
    samples: [
        {
            inputs: { array: [1, 2, 3] },
            params: {},
            result: {
                array: [2, 3],
                item: 1,
            },
        },
        {
            inputs: { array: ["a", "b", "c"] },
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
