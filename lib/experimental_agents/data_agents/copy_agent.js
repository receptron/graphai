"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyAgent = void 0;
const copyAgent = async ({ inputs }) => {
    const [input] = inputs;
    return input;
};
exports.copyAgent = copyAgent;
const copyAgentInfo = {
    name: "copyAgent",
    agent: exports.copyAgent,
    mock: exports.copyAgent,
    samples: [
        {
            inputs: [{ color: "red", model: "Model 3" }],
            result: { color: "red", model: "Model 3" },
        },
        {
            inputs: ["Hello World"],
            result: "Hello World",
        },
    ],
    description: "Returns inputs[0]",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = copyAgentInfo;
