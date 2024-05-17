"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringTemplateAgent = void 0;
const processTemplate = (template, match, input) => {
    if (typeof template === "string") {
        return template.replace(match, input);
    }
    else if (Array.isArray(template)) {
        return template.map((item) => processTemplate(item, match, input));
    }
    return Object.keys(template).reduce((tmp, key) => {
        tmp[key] = processTemplate(template[key], match, input);
        return tmp;
    }, {});
};
const stringTemplateAgent = async ({ params, inputs }) => {
    return inputs.reduce((template, input, index) => {
        return processTemplate(template, "${" + index + "}", input);
    }, params.template);
};
exports.stringTemplateAgent = stringTemplateAgent;
const sampleInput = ["hello", "test"];
// for test and document
const stringTemplateAgentInfo = {
    name: "stringTemplateAgent",
    agent: exports.stringTemplateAgent,
    mock: exports.stringTemplateAgent,
    samples: [
        {
            inputs: sampleInput,
            params: { template: "${0}: ${1}" },
            result: "hello: test",
        },
        {
            inputs: sampleInput,
            params: { template: ["${0}: ${1}", "${1}: ${0}"] },
            result: ["hello: test", "test: hello"],
        },
        {
            inputs: sampleInput,
            params: { template: { apple: "${0}", lemon: "${1}" } },
            result: { apple: "hello", lemon: "test" },
        },
        {
            inputs: sampleInput,
            params: { template: [{ apple: "${0}", lemon: "${1}" }] },
            result: [{ apple: "hello", lemon: "test" }],
        },
        {
            inputs: sampleInput,
            params: { template: { apple: "${0}", lemon: ["${1}"] } },
            result: { apple: "hello", lemon: ["test"] },
        },
    ],
    description: "Template agent",
    category: ["string"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = stringTemplateAgentInfo;
