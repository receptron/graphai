(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('graphai'), require('fs'), require('path')) :
    typeof define === 'function' && define.amd ? define(['exports', 'graphai', 'fs', 'path'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vanilla_agents = {}, global.graphai, global.fs, global.path));
})(this, (function (exports, graphai, fs, path) { 'use strict';

    const fileReadAgent = async ({ namedInputs, params }) => {
        const { basePath, outputType } = params;
        // arrayValidate("fileReadAgent", namedInputs);
        graphai.assert(!!basePath, "fileReadAgent: params.basePath is UNDEFINED!");
        const fileToData = (fileName) => {
            const file = path.resolve(path.join(basePath, fileName));
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

    exports.fileReadAgent = fileReadAgentInfo;

}));
//# sourceMappingURL=bundle.umd.js.map
