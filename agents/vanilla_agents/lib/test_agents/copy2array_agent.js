"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy2ArrayAgent = void 0;
const graphai_1 = require("graphai");
const agent_utils_1 = require("@graphai/agent_utils");
const copy2ArrayAgent = async ({ namedInputs, params }) => {
    (0, graphai_1.assert)((0, agent_utils_1.isNamedInputs)(namedInputs), "copy2ArrayAgent: namedInputs is UNDEFINED!");
    const input = (namedInputs.item ? namedInputs.item : namedInputs);
    return new Array(params.count).fill(undefined).map(() => {
        return input;
    });
};
exports.copy2ArrayAgent = copy2ArrayAgent;
// for test and document
const copy2ArrayAgentInfo = {
    name: "copy2ArrayAgent",
    agent: exports.copy2ArrayAgent,
    mock: exports.copy2ArrayAgent,
    samples: [
        {
            inputs: { item: { message: "hello" } },
            params: { count: 10 },
            result: [
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
            ],
        },
        {
            inputs: { message: "hello" },
            params: { count: 10 },
            result: [
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
            ],
        },
        {
            inputs: { item: "hello" },
            params: { count: 10 },
            result: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
        },
    ],
    description: "Copy2Array agent",
    category: ["test"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = copy2ArrayAgentInfo;
