"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyAgent = void 0;
const graphai_1 = require("graphai");
const agent_utils_1 = require("@graphai/agent_utils");
const copyAgent = async ({ namedInputs, params }) => {
    const { namedKey } = params;
    (0, graphai_1.assert)((0, agent_utils_1.isNamedInputs)(namedInputs), "copyAgent: namedInputs is UNDEFINED!");
    if (namedKey) {
        return namedInputs[namedKey];
    }
    return namedInputs;
};
exports.copyAgent = copyAgent;
const copyAgentInfo = {
    name: "copyAgent",
    agent: exports.copyAgent,
    mock: exports.copyAgent,
    inputs: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
    },
    output: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
    },
    samples: [
        {
            inputs: { color: "red", model: "Model 3" },
            params: {},
            result: { color: "red", model: "Model 3" },
        },
        {
            inputs: { array: ["Hello World", "Discarded"] },
            params: {},
            result: { array: ["Hello World", "Discarded"] },
        },
        {
            inputs: { color: "red", model: "Model 3" },
            params: { namedKey: "color" },
            result: "red",
        },
    ],
    description: "Returns namedInputs",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = copyAgentInfo;
