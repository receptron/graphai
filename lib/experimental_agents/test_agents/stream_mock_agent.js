"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamMockAgent = void 0;
const utils_1 = require("../../utils/utils");
const streamMockAgent = async ({ params }) => {
    const message = params.message;
    for await (const token of message.split("")) {
        if (params.streamCallback) {
            params.streamCallback(token);
        }
        await (0, utils_1.sleep)(params.sleep || 100);
    }
    return params;
};
exports.streamMockAgent = streamMockAgent;
// for test and document
const streamMockAgentInfo = {
    name: "streamMockAgent",
    agent: exports.streamMockAgent,
    mock: exports.streamMockAgent,
    samples: [],
    description: "Sstream mock agent",
    category: [],
    author: "xSatoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = streamMockAgentInfo;
