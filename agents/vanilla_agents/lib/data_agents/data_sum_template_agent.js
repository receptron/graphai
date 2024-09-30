"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSumTemplateAgent = void 0;
const graphai_1 = require("graphai");
const agent_utils_1 = require("@graphai/agent_utils");
const dataSumTemplateAgent = async ({ namedInputs }) => {
    (0, graphai_1.assert)((0, agent_utils_1.isNamedInputs)(namedInputs), "dataSumTemplateAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    (0, graphai_1.assert)(!!namedInputs?.array, "dataSumTemplateAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    return namedInputs.array.reduce((tmp, input) => {
        return tmp + input;
    }, 0);
};
exports.dataSumTemplateAgent = dataSumTemplateAgent;
const dataSumTemplateAgentInfo = {
    name: "dataSumTemplateAgent",
    agent: exports.dataSumTemplateAgent,
    mock: exports.dataSumTemplateAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array of numbers to calculate the sum of",
                items: {
                    type: "integer",
                },
            },
        },
        required: ["array"],
    },
    output: {
        type: "number",
    },
    samples: [
        {
            inputs: { array: [1] },
            params: {},
            result: 1,
        },
        {
            inputs: { array: [1, 2] },
            params: {},
            result: 3,
        },
        {
            inputs: { array: [1, 2, 3] },
            params: {},
            result: 6,
        },
    ],
    description: "Returns the sum of input values",
    category: ["data"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = dataSumTemplateAgentInfo;
