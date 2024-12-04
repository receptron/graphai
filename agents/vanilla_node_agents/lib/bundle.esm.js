import { assert } from 'graphai';
import fs from 'fs';
import path from 'path';

const fileReadAgent = async ({ namedInputs, params }) => {
    const { basePath, outputType } = params;
    // arrayValidate("fileReadAgent", namedInputs);
    assert(!!basePath, "fileReadAgent: params.basePath is UNDEFINED!");
    const fileToData = (fileName) => {
        const file = path.resolve([basePath, fileName].join("/"));
        const buffer = fs.readFileSync(file);
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
const fileReadAgentInfo = {
    name: "fileReadAgent",
    agent: fileReadAgent,
    mock: fileReadAgent,
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
        {
            inputs: { file: "test.txt" },
            params: { basePath: __dirname + "/../../tests/files/", outputType: "text" },
            result: {
                data: "hello\n",
            },
        },
    ],
    description: "Read data from file system and returns data",
    category: ["fs"],
    author: "Receptron team",
    repository: "https://github.com/snakajima/graphai",
    license: "MIT",
};

export { fileReadAgentInfo as fileReadAgent };
//# sourceMappingURL=bundle.esm.js.map
