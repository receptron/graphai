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
    ],
    description: "Returns the sum of input values",
    category: [],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = dataSumTemplateAgentInfo;
