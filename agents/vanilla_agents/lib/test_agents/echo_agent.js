"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.echoAgent = void 0;
const echoAgent = async ({ params, filterParams }) => {
    if (params.filterParams) {
        return filterParams;
    }
    return params;
};
exports.echoAgent = echoAgent;
// for test and document
const echoAgentInfo = {
    name: "echoAgent",
    agent: exports.echoAgent,
    mock: exports.echoAgent,
    inputs: {
        type: "object",
        description: "This agent does not use inputs. Leave empty.",
        properties: {},
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "Any parameters you want to echo back. If 'filterParams' is true, only filtered parameters will be returned.",
        properties: {
            filterParams: {
                type: "boolean",
                description: "If true, returns 'filterParams' instead of the full 'params'.",
            },
        },
        additionalProperties: true,
    },
    output: {
        type: "object",
        description: "Returns the full 'params' object or the 'filterParams' object if 'filterParams' is set to true.",
        additionalProperties: true,
    },
    samples: [
        {
            inputs: {},
            params: { text: "this is test" },
            result: { text: "this is test" },
        },
        {
            inputs: {},
            params: {
                text: "If you add filterParams option, it will respond to filterParams",
                filterParams: true,
            },
            result: {},
        },
    ],
    description: "Echo agent",
    category: ["test"],
    cacheType: "pureAgent",
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/echo_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = echoAgentInfo;
