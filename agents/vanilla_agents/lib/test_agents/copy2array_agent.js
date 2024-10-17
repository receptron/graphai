"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy2ArrayAgent = void 0;
const agent_utils_1 = require("@graphai/agent_utils");
const copy2ArrayAgent = async ({ inputs, namedInputs, params }) => {
    const input = (0, agent_utils_1.isNamedInputs)(namedInputs) ? namedInputs.item : inputs[0];
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
            inputs: [{ message: "hello" }],
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
    ],
    description: "Copy2Array agent",
    category: ["test"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = copy2ArrayAgentInfo;
