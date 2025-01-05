"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileWriteAgent = void 0;
const graphai_1 = require("graphai");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fileWriteAgent = async ({ namedInputs, params }) => {
    const { baseDir } = params;
    const { text, buffer, file } = namedInputs;
    // assert(!!baseDir, "fileWriteAgent: params.baseDir is UNDEFINED!");
    (0, graphai_1.assert)(!!file, "fileWriteAgent: inputs.file is UNDEFINED!");
    (0, graphai_1.assert)(!!text || !!buffer, "fileWriteAgent: inputs.file and inputs.buffer are UNDEFINED!");
    const filePath = baseDir ? path_1.default.resolve(path_1.default.join(baseDir, file)) : file;
    fs_1.default.writeFileSync(filePath, text ?? buffer ?? "");
    return {
        result: true,
    };
};
exports.fileWriteAgent = fileWriteAgent;
const fileWriteAgentInfo = {
    name: "fileWriteAgent",
    agent: exports.fileWriteAgent,
    mock: exports.fileWriteAgent,
    inputs: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "text data",
            },
            file: {
                type: "string",
                description: "file name",
            },
        },
        required: ["text", "file"],
    },
    output: {
        type: "object",
    },
    samples: [
        {
            inputs: { file: "write.txt", text: "hello" },
            params: { baseDir: __dirname + "/../../tests/files/" },
            result: {
                result: true,
            },
        },
    ],
    description: "Write data to file system",
    category: ["fs"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = fileWriteAgentInfo;
