"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringTemplateAgent = void 0;
// see example
//  tests/agents/test_string_agent.ts
const stringTemplateAgent = async ({ params, inputs }) => {
    const content = inputs.reduce((template, input, index) => {
        return template.replace("${" + index + "}", input);
    }, params.template);
    return content;
};
exports.stringTemplateAgent = stringTemplateAgent;
const sampleInput = ["hello", "test"];
const sampleParams = { template: "${0}: ${1}" };
const sampleResult = "hello: test";
// for test and document
const stringTemplateAgentInfo = {
    name: "stringTemplateAgent",
    agent: exports.stringTemplateAgent,
    mock: exports.stringTemplateAgent,
    samples: [
        {
            inputs: sampleInput,
            params: sampleParams,
            result: sampleResult,
        },
    ],
    description: "Template agent",
    category: [],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = stringTemplateAgentInfo;
