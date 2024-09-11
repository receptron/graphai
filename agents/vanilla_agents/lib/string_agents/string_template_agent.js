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
const stringTemplateAgent = async ({ params, inputs, namedInputs }) => {
    if (params.template === undefined) {
        console.warn("warning: stringTemplateAgent no template");
    }
    if (inputs && inputs.length > 0) {
        return inputs.reduce((template, input, index) => {
            return processTemplate(template, "${" + index + "}", input);
        }, params.template);
    }
    return Object.keys(namedInputs).reduce((template, key) => {
        return processTemplate(template, "${" + key + "}", namedInputs[key]);
    }, params.template);
};
exports.stringTemplateAgent = stringTemplateAgent;
const sampleInput = ["hello", "test"];
const sampleNamedInput = { message1: "hello", message2: "test" };
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
        // named
        {
            inputs: sampleNamedInput,
            params: { template: "${message1}: ${message2}" },
            result: "hello: test",
        },
        {
            inputs: sampleNamedInput,
            params: { template: ["${message1}: ${message2}", "${message2}: ${message1}"] },
            result: ["hello: test", "test: hello"],
        },
        {
            inputs: sampleNamedInput,
            params: { template: { apple: "${message1}", lemon: "${message2}" } },
            result: { apple: "hello", lemon: "test" },
        },
        {
            inputs: sampleNamedInput,
            params: { template: [{ apple: "${message1}", lemon: "${message2}" }] },
            result: [{ apple: "hello", lemon: "test" }],
        },
        {
            inputs: sampleNamedInput,
            params: { template: { apple: "${message1}", lemon: ["${message2}"] } },
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
