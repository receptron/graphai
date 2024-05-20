"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamMockAgent = void 0;
const utils_1 = require("../../utils/utils");
const streamMockAgent = async ({ params, filterParams }) => {
    const message = params.message || "";
    for await (const token of message.split("")) {
        if (filterParams.streamTokenCallback) {
            filterParams.streamTokenCallback(token);
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
    samples: [
        {
            inputs: [],
            params: { message: "this is test" },
            result: { message: "this is test" },
        },
    ],
    description: "Stream mock agent",
    category: ["test"],
    author: "Isamu Arimoto",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = streamMockAgentInfo;
