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
        if (outputType && outputType === "stream") {
            return fs_1.default.createReadStream(file);
        }
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
            file: {
                type: "string",
                description: "Name of a single file to read",
            },
            array: {
                type: "array",
                items: {
                    type: "string",
                },
                description: "List of multiple file names to read",
            },
        },
        oneOf: [{ required: ["file"] }, { required: ["array"] }],
    },
    params: {
        type: "object",
        properties: {
            baseDir: {
                type: "string",
                description: "Base directory where the file(s) are located",
            },
            outputType: {
                type: "string",
                enum: ["text", "base64", "stream"],
                description: "Desired output format. If omitted, returns raw Buffer",
            },
        },
    },
    output: {
        oneOf: [
            {
                type: "object",
                required: ["data"],
                properties: {
                    data: {
                        oneOf: [
                            { type: "string", description: "Text or base64 depending on outputType" },
                            { type: "object", description: "Readable stream (not serializable in JSON)" },
                            { type: "array", items: { type: "number" }, description: "Buffer (as byte array)" },
                        ],
                    },
                },
                additionalProperties: false,
            },
            {
                type: "object",
                required: ["array"],
                properties: {
                    array: {
                        type: "array",
                        items: {
                            oneOf: [
                                { type: "string", description: "Text or base64 string" },
                                { type: "object", description: "Readable stream (not serializable in JSON)" },
                                { type: "array", items: { type: "number" }, description: "Buffer (as byte array)" },
                            ],
                        },
                    },
                },
                additionalProperties: false,
            },
        ],
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
            description: "Reads a single file named 'test.txt' from the given base directory and returns its contents as a UTF-8 string.",
        },
    ],
    description: "Read data from file system and returns data",
    category: ["fs"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_node_agents/src/node_file_agents/file_read_agent.ts",
    package: "@graphai/vanilla_node_agents",
    license: "MIT",
};
exports.default = fileReadAgentInfo;
