"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSumTemplateAgent = void 0;
const dataSumTemplateAgent = async ({ inputs }) => {
    return inputs.reduce((tmp, input) => {
        return tmp + input;
    }, 0);
};
exports.dataSumTemplateAgent = dataSumTemplateAgent;
// for test and document
const sampleInputs = [1, 2, 3];
const sampleParams = {};
const sampleResult = 6;
const dataSumTemplateAgentInfo = {
    name: "dataSumTemplateAgent",
    agent: exports.dataSumTemplateAgent,
    mock: exports.dataSumTemplateAgent,
    samples: [
        {
            inputs: sampleInputs,
            params: sampleParams,
            result: sampleResult,
        },
        {
            inputs: [1],
            params: {},
            result: 1,
        },
        {
            inputs: [1, 2],
            params: {},
            result: 3,
        },
        {
            inputs: [1, 2, 3],
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
