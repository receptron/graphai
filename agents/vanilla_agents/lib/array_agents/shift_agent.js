"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftAgent = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const shiftAgent = async ({ namedInputs }) => {
    (0, node_assert_1.default)(namedInputs, "shiftAgent: namedInputs is UNDEFINED!");
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
                type: "any",
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
