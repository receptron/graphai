"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalAgent = void 0;
const graphai_1 = require("graphai");
const agent_utils_1 = require("@graphai/agent_utils");
const totalAgent = async ({ namedInputs }) => {
    (0, graphai_1.assert)((0, agent_utils_1.isNamedInputs)(namedInputs), "totalAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    (0, graphai_1.assert)(!!namedInputs?.array, "totalAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    return namedInputs.array.reduce((result, input) => {
        const inputArray = Array.isArray(input) ? input : [input];
        inputArray.forEach((innerInput) => {
            Object.keys(innerInput).forEach((key) => {
                const value = innerInput[key];
                if (result[key]) {
                    result[key] += value;
                }
                else {
                    result[key] = value;
                }
            });
        });
        return result;
    }, {});
};
exports.totalAgent = totalAgent;
//
const totalAgentInfo = {
    name: "totalAgent",
    agent: exports.totalAgent,
    mock: exports.totalAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
    },
    samples: [
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: {},
            result: { a: 6 },
        },
        {
            inputs: { array: [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]] },
            params: {},
            result: { a: 6, b: -4, c: 10, d: -10 },
        },
        {
            inputs: { array: [{ a: 1 }] },
            params: {},
            result: { a: 1 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }] },
            params: {},
            result: { a: 3 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: {},
            result: { a: 6 },
        },
        {
            inputs: {
                array: [
                    { a: 1, b: 1 },
                    { a: 2, b: 2 },
                    { a: 3, b: 0 },
                ],
            },
            params: {},
            result: { a: 6, b: 3 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2, b: 2 }, { a: 3, b: 0 }] },
            params: {},
            result: { a: 6, b: 2 },
        },
    ],
    description: "Returns the sum of input values",
    category: ["data"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/snakajima/graphai",
    license: "MIT",
};
exports.default = totalAgentInfo;
