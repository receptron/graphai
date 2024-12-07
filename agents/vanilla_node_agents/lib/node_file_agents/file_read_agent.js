"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileReadAgent = void 0;
const graphai_1 = require("graphai");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fileReadAgent = async ({ namedInputs, params }) => {
    const { baseDir, outputType } = params;
    (0, graphai_1.assert)(!!baseDir, "fileReadAgent: params.baseDir is UNDEFINED!");
    const fileToData = (fileName) => {
        const file = path_1.default.resolve(path_1.default.join(baseDir, fileName));
        const buffer = fs_1.default.readFileSync(file);
        if (outputType && outputType === "base64") {
            return buffer.toString("base64");
        }
        if (outputType && outputType === "text") {
            return new TextDecoder().decode(buffer);
        }
        return buffer;
    };
    if (namedInputs.array) {
        return {
            array: namedInputs.array.map(fileToData),
        };
    }
    if (namedInputs.file) {
        return {
            data: fileToData(namedInputs.file),
        };
    }
    throw new Error("fileReadAgent no file");
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
            params: { baseDir: __dirname + "/../../tests/files/" },
            result: {
                array: [Buffer.from([104, 101, 108, 108, 111, 10])],
            },
        },
        {
            inputs: { array: ["test.txt"] },
            params: { baseDir: __dirname + "/../../tests/files/", outputType: "base64" },
            result: {
                array: ["aGVsbG8K"],
            },
        },
        {
            inputs: { array: ["test.txt"] },
            params: { baseDir: __dirname + "/../../tests/files/", outputType: "text" },
            result: {
                array: ["hello\n"],
            },
        },
        {
            inputs: { file: "test.txt" },
            params: { baseDir: __dirname + "/../../tests/files/", outputType: "text" },
            result: {
                data: "hello\n",
            },
        },
    ],
    description: "Read data from file system and returns data",
    category: ["fs"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = fileReadAgentInfo;
