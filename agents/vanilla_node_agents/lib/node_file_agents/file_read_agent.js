"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileReadAgent = void 0;
const graphai_1 = require("graphai");
const fs_1 = __importDefault(require("fs"));
const agent_utils_1 = require("@graphai/agent_utils");
const fileReadAgent = async ({ namedInputs, params }) => {
    const { basePath, outputType } = params;
    (0, agent_utils_1.arrayValidate)("fileReadAgent", namedInputs);
    (0, graphai_1.assert)(!!basePath, "fileReadAgent: params.basePath is UNDEFINED!");
    const files = namedInputs.array.map((file) => {
        const path = basePath + file;
        const buffer = fs_1.default.readFileSync(path);
        if (outputType && outputType === "base64") {
            return buffer.toString("base64");
        }
        if (outputType && outputType === "text") {
            return new TextDecoder().decode(buffer);
        }
        return buffer;
    });
    return {
        array: files,
    };
};
exports.fileReadAgent = fileReadAgent;
const fileReadAgentInfo = {
    name: "fileReadAgent",
    agent: exports.fileReadAgent,
    mock: exports.fileReadAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "file names",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
    },
    samples: [
        {
            inputs: { array: ["test.txt"] },
            params: { basePath: __dirname + "/../../tests/files/" },
            result: {
                array: [Buffer.from([104, 101, 108, 108, 111, 10])],
            },
        },
        {
            inputs: { array: ["test.txt"] },
            params: { basePath: __dirname + "/../../tests/files/", outputType: "base64" },
            result: {
                array: ["aGVsbG8K"],
            },
        },
        {
            inputs: { array: ["test.txt"] },
            params: { basePath: __dirname + "/../../tests/files/", outputType: "text" },
            result: {
                array: ["hello\n"],
            },
        },
    ],
    description: "Read data from file system and returns data",
    category: ["fs"],
    author: "Receptron team",
    repository: "https://github.com/snakajima/graphai",
    license: "MIT",
};
exports.default = fileReadAgentInfo;
