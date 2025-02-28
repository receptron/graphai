"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamMockAgent = void 0;
const graphai_1 = require("graphai");
const streamMockAgent = async ({ params, filterParams, namedInputs, }) => {
    const message = params.message ?? namedInputs.message ?? "";
    for await (const token of message.split("")) {
        if (filterParams.streamTokenCallback) {
            filterParams.streamTokenCallback(token);
        }
        await (0, graphai_1.sleep)(params.sleep || 100);
    }
    return { message };
};
exports.streamMockAgent = streamMockAgent;
// for test and document
const streamMockAgentInfo = {
    name: "streamMockAgent",
    agent: exports.streamMockAgent,
    mock: exports.streamMockAgent,
    inputs: {
        anyOf: [
            {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "streaming message",
                    },
                },
            },
            {
                type: "array",
            },
        ],
    },
    samples: [
        {
            inputs: {},
            params: { message: "this is params test" },
            result: { message: "this is params test" },
        },
        {
            inputs: { message: "this is named inputs test" },
            params: {},
            result: { message: "this is named inputs test" },
        },
    ],
    description: "Stream mock agent",
    category: ["test"],
    author: "Isamu Arimoto",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
    stream: true,
};
exports.default = streamMockAgentInfo;
