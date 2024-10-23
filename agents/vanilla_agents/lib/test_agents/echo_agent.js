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
    samples: [
        {
            inputs: {},
            params: { message: "this is test" },
            result: { message: "this is test" },
        },
        {
            inputs: {},
            params: {
                message: "If you add filterParams option, it will respond to filterParams",
                filterParams: true,
            },
            result: {},
        },
    ],
    description: "Echo agent",
    category: ["test"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = echoAgentInfo;
