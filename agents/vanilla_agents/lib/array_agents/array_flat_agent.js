"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayFlatAgent = void 0;
const agent_utils_1 = require("@graphai/agent_utils");
const arrayFlatAgent = async ({ namedInputs, params }) => {
    (0, agent_utils_1.arrayValidate)("arrayFlatAgent", namedInputs);
    const depth = params.depth ?? 1;
    const array = namedInputs.array.map((item) => item); // shallow copy
    return { array: array.flat(depth) };
};
exports.arrayFlatAgent = arrayFlatAgent;
const arrayFlatAgentInfo = {
    name: "arrayFlatAgent",
    agent: exports.arrayFlatAgent,
    mock: exports.arrayFlatAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "flat array",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the remaining array",
            },
        },
    },
    params: {
        type: "object",
        properties: {
            depth: {
                type: "number",
                description: "array depth",
            },
        },
    },
    samples: [
        {
            inputs: { array: [[1], [2], [3]] },
            params: {},
            result: {
                array: [1, 2, 3],
            },
        },
        {
            inputs: { array: [[1], [2], [[3]]] },
            params: {},
            result: {
                array: [1, 2, [3]],
            },
        },
        {
            inputs: { array: [[1], [2], [[3]]] },
            params: { depth: 2 },
            result: {
                array: [1, 2, 3],
            },
        },
        {
            inputs: { array: [["a"], ["b"], ["c"]] },
            params: {},
            result: {
                array: ["a", "b", "c"],
            },
        },
    ],
    description: "Array Flat Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    cacheType: "pureAgent",
    license: "MIT",
};
exports.default = arrayFlatAgentInfo;
