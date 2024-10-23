"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringTemplateAgent = void 0;
const utils_1 = require("graphai/lib/utils/utils");
const processTemplate = (template, match, input) => {
    if (typeof template === "string") {
        if (template === match) {
            return input;
        }
        return template.replace(match, input);
    }
    else if (Array.isArray(template)) {
        return template.map((item) => processTemplate(item, match, input));
    }
    if ((0, utils_1.isObject)(template)) {
        return Object.keys(template).reduce((tmp, key) => {
            tmp[key] = processTemplate(template[key], match, input);
            return tmp;
        }, {});
    }
    return template;
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
const sampleNamedInput = { message1: "hello", message2: "test" };
// for test and document
const stringTemplateAgentInfo = {
    name: "stringTemplateAgent",
    agent: exports.stringTemplateAgent,
    mock: exports.stringTemplateAgent,
    samples: [
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
        // graphData
        {
            inputs: { agent: "openAiAgent", row: "hello world", params: { text: "message" } },
            params: {
                template: {
                    version: 0.5,
                    nodes: {
                        ai: {
                            agent: "${agent}",
                            isResult: true,
                            params: "${params}",
                            inputs: { prompt: "${row}" },
                        },
                    },
                },
            },
            result: {
                nodes: {
                    ai: {
                        agent: "openAiAgent",
                        inputs: {
                            prompt: "hello world",
                        },
                        isResult: true,
                        params: { text: "message" },
                    },
                },
                version: 0.5,
            },
        },
    ],
    description: "Template agent",
    category: ["string"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = stringTemplateAgentInfo;
