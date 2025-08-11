"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushAgent = void 0;
const graphai_1 = require("graphai");
const agent_utils_1 = require("@graphai/agent_utils");
const pushAgent = async ({ namedInputs, params, }) => {
    const extra_message = " Set inputs: { array: :arrayNodeId, item: :itemNodeId }";
    (0, agent_utils_1.arrayValidate)("pushAgent", namedInputs, extra_message);
    const { item, items } = namedInputs;
    (0, graphai_1.assert)(item !== undefined || items !== undefined, "pushAgent: namedInputs.item and namedInputs.items are UNDEFINED!" + extra_message);
    (0, graphai_1.assert)(items === undefined || Array.isArray(items), "pushAgent: namedInputs.items is not array!");
    const array = namedInputs.array.map((item) => item); // shallow copy
    if (item !== undefined) {
        array.push(item);
    }
    if (items) {
        items.forEach((item) => {
            array.push(item);
        });
    }
    if (params.arrayKey) {
        return {
            [params.arrayKey]: array,
        };
    }
    return {
        array,
    };
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
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }, { type: "boolean" }],
                description: "the item push into the array",
            },
            items: {
                type: "array",
                description: "items push into the array",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            array: {
                type: "array",
            },
        },
    },
    samples: [
        {
            inputs: { array: [1, 2], item: 3 },
            params: {},
            result: { array: [1, 2, 3] },
        },
        {
            inputs: { array: [true, false], item: false },
            params: {},
            result: { array: [true, false, false] },
        },
        {
            inputs: { array: [{ apple: 1 }], item: { lemon: 2 } },
            params: {},
            result: { array: [{ apple: 1 }, { lemon: 2 }] },
        },
        {
            inputs: { array: [{ apple: 1 }], items: [{ lemon: 2 }, { banana: 3 }] },
            params: {},
            result: { array: [{ apple: 1 }, { lemon: 2 }, { banana: 3 }] },
        },
        {
            inputs: { array: [1, 2], item: 3 },
            params: { arrayKey: "test" },
            result: { test: [1, 2, 3] },
        },
    ],
    description: "push Agent",
    category: ["array"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/push_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = pushAgentInfo;
