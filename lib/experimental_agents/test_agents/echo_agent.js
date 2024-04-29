"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.echoAgent = void 0;
const echoAgent = async ({ params }) => {
    return params;
};
exports.echoAgent = echoAgent;
// for test and document
const echoAgentInfo = {
    name: "echoAgent",
    agent: exports.echoAgent,
    mock: exports.echoAgent,
    samples: [],
    description: "Echo agent",
    category: [],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = echoAgentInfo;
