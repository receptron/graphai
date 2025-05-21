"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayToObjectAgent = void 0;
const graphai_1 = require("graphai");
const agent_utils_1 = require("@graphai/agent_utils");
const arrayToObjectAgent = async ({ params, namedInputs }) => {
    (0, graphai_1.assert)((0, agent_utils_1.isNamedInputs)(namedInputs), "arrayToObjectAgent: namedInputs is UNDEFINED!");
    const { items } = namedInputs;
    const { key } = params;
    (0, graphai_1.assert)(items !== undefined && Array.isArray(items), "arrayToObjectAgent: namedInputs.items is not array!");
    (0, graphai_1.assert)(key !== undefined && key !== null, "arrayToObjectAgent: params.key is UNDEFINED!");
    return namedInputs.items.reduce((tmp, current) => {
        tmp[current[key]] = current;
        return tmp;
    }, {});
};
exports.arrayToObjectAgent = arrayToObjectAgent;
const arrayToObjectAgentInfo = {
    name: "arrayToObjectAgent",
    agent: exports.arrayToObjectAgent,
    mock: exports.arrayToObjectAgent,
    inputs: {
        type: "object",
        properties: {
            items: {
                type: "array",
                description: "the array to pop an item from",
            },
        },
        required: ["items"],
    },
    output: {
        type: "object",
        properties: {
            anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
            description: "the item popped from the array",
        },
    },
    samples: [
        {
            inputs: {
                items: [
                    { id: 1, data: "a" },
                    { id: 2, data: "b" },
                ],
            },
            params: { key: "id" },
            result: {
                "1": { id: 1, data: "a" },
                "2": { id: 2, data: "b" },
            },
        },
    ],
    description: "Array To Object Agent",
    category: ["array"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_to_object.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = arrayToObjectAgentInfo;
