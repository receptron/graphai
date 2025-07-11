"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringTemplateAgent = void 0;
const graphai_1 = require("graphai");
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
    if ((0, graphai_1.isObject)(template)) {
        return Object.keys(template).reduce((tmp, key) => {
            tmp[key] = processTemplate(template[key], match, input);
            return tmp;
        }, {});
    }
    return template;
};
const stringTemplateAgent = async ({ params, namedInputs }) => {
    if (params.template === undefined) {
        if (namedInputs.text) {
            return namedInputs.text;
        }
        console.warn("warning: stringTemplateAgent no template");
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
    inputs: {
        type: "object",
        description: "Key-value pairs where each key corresponds to a variable used in the template (e.g., ${key}).",
        additionalProperties: {
            type: ["string", "number", "boolean", "object", "array", "null"],
            description: "Any value to be substituted into the template. Objects and arrays are injected directly if the entire field is a placeholder.",
        },
    },
    params: {
        type: "object",
        description: "The template to apply substitutions to. Supports strings, arrays, and deeply nested object structures with placeholder strings.",
        properties: {
            template: {
                description: "The template structure where placeholders like ${key} will be replaced with values from 'inputs'.",
                anyOf: [
                    { type: "string" },
                    {
                        type: "array",
                        items: {
                            anyOf: [
                                { type: "string" },
                                {
                                    type: "object",
                                    additionalProperties: {
                                        anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        type: "object",
                        additionalProperties: {
                            anyOf: [
                                { type: "string" },
                                {
                                    type: "array",
                                    items: { type: "string" },
                                },
                                {
                                    type: "object",
                                    additionalProperties: true,
                                },
                            ],
                        },
                    },
                ],
            },
        },
        required: ["template"],
        additionalProperties: false,
    },
    output: {
        description: "The result after placeholder substitution, matching the structure and type of the original template.",
        anyOf: [
            { type: "string" },
            {
                type: "array",
                items: {
                    anyOf: [
                        { type: "string" },
                        {
                            type: "object",
                            additionalProperties: true,
                        },
                    ],
                },
            },
            {
                type: "object",
                additionalProperties: true,
            },
        ],
    },
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
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/string_template_agent.ts",
    package: "@graphai/vanilla",
    cacheType: "pureAgent",
    license: "MIT",
};
exports.default = stringTemplateAgentInfo;
