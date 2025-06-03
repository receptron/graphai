"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyMessageAgent = void 0;
const copyMessageAgent = async ({ params }) => {
    return {
        messages: new Array(params.count).fill(undefined).map(() => {
            return params.message;
        }),
    };
};
exports.copyMessageAgent = copyMessageAgent;
// for test and document
const copyMessageAgentInfo = {
    name: "copyMessageAgent",
    agent: exports.copyMessageAgent,
    mock: exports.copyMessageAgent,
    inputs: {
        type: "object",
        description: "This agent does not use any inputs. Leave empty.",
        properties: {},
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "Parameters to define the message and how many times to repeat it.",
        properties: {
            count: {
                type: "integer",
                minimum: 1,
                description: "The number of times the message should be duplicated in the array.",
            },
            message: {
                type: "string",
                description: "The message string to be repeated.",
            },
        },
        required: ["count", "message"],
        additionalProperties: false,
    },
    output: {
        type: "object",
        description: "An object containing the repeated messages.",
        properties: {
            messages: {
                type: "array",
                description: "An array of repeated message strings.",
                items: {
                    type: "string",
                },
            },
        },
        required: ["messages"],
        additionalProperties: false,
    },
    samples: [
        {
            inputs: {},
            params: { count: 4, message: "hello" },
            result: { messages: ["hello", "hello", "hello", "hello"] },
        },
    ],
    description: "CopyMessage agent",
    category: ["test"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/copy_message_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = copyMessageAgentInfo;
