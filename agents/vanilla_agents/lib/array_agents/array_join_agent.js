"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayJoinAgent = void 0;
const agent_utils_1 = require("@graphai/agent_utils");
const arrayJoinAgent = async ({ namedInputs, params, }) => {
    (0, agent_utils_1.arrayValidate)("arrayJoinAgent", namedInputs);
    const separator = params.separator ?? "";
    const { flat } = params;
    const text = flat ? namedInputs.array.flat(flat).join(separator) : namedInputs.array.join(separator);
    return { text };
};
exports.arrayJoinAgent = arrayJoinAgent;
const arrayJoinAgentInfo = {
    name: "arrayJoinAgent",
    agent: exports.arrayJoinAgent,
    mock: exports.arrayJoinAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "array join",
            },
        },
        required: ["array"],
    },
    params: {
        type: "object",
        properties: {
            separator: {
                type: "string",
                description: "array join separator",
            },
            flat: {
                type: "number",
                description: "array flat depth",
            },
        },
    },
    output: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "joined text",
            },
        },
    },
    samples: [
        {
            inputs: { array: [[1], [2], [3]] },
            params: {},
            result: {
                text: "123",
            },
        },
        {
            inputs: { array: [[1], [2], [[3]]] },
            params: {},
            result: {
                text: "123",
            },
        },
        {
            inputs: { array: [["a"], ["b"], ["c"]] },
            params: {},
            result: {
                text: "abc",
            },
        },
        //
        {
            inputs: { array: [[1], [2], [3]] },
            params: { separator: "|" },
            result: {
                text: "1|2|3",
            },
        },
        {
            inputs: { array: [[[1]], [[2], [3]]] },
            params: { separator: "|" },
            result: {
                text: "1|2,3",
            },
        },
        {
            inputs: { array: [[[1]], [[2], [3]]] },
            params: { separator: "|", flat: 1 },
            result: {
                text: "1|2|3",
            },
        },
        {
            inputs: { array: [[[[1]], [[2], [3]]]] },
            params: { separator: "|", flat: 1 },
            result: {
                text: "1|2,3",
            },
        },
        {
            inputs: { array: [[[[1]], [[2], [3]]]] },
            params: { separator: "|", flat: 2 },
            result: {
                text: "1|2|3",
            },
        },
    ],
    description: "Array Join Agent",
    category: ["array"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = arrayJoinAgentInfo;
