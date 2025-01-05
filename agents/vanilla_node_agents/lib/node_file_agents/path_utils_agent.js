"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathUtilsAgent = void 0;
const graphai_1 = require("graphai");
const path_1 = __importDefault(require("path"));
// https://nodejs.org/api/path.html
const pathUtilsAgent = async ({ namedInputs, params }) => {
    const { method } = params;
    (0, graphai_1.assert)(!!method, "pathUtilsAgent: params.method is UNDEFINED!");
    const { dirs, path: userPath } = {
        ...params,
        ...namedInputs,
    };
    if (method === "resolve") {
        (0, graphai_1.assert)(!!Array.isArray(dirs), "pathUtilsAgent: dir is not Array!");
        return {
            path: path_1.default.resolve(...dirs),
        };
    }
    if (method === "join") {
        (0, graphai_1.assert)(!!Array.isArray(dirs), "pathUtilsAgent: dir is not Array!");
        return {
            path: path_1.default.join(...dirs),
        };
    }
    if (method === "normalize") {
        (0, graphai_1.assert)(!!userPath, "pathUtilsAgent: path is UNDEFINED!");
        return {
            path: path_1.default.normalize(userPath),
        };
    }
    throw new Error("pathUtilsAgent no file");
};
exports.pathUtilsAgent = pathUtilsAgent;
const pathUtilsAgentInfo = {
    name: "pathUtilsAgent",
    agent: exports.pathUtilsAgent,
    mock: exports.pathUtilsAgent,
    inputs: {
        type: "object",
        properties: {
            dirs: {
                type: "array",
                description: "directory names",
            },
        },
        required: ["dirs"],
    },
    output: {
        path: {
            type: "string",
        },
    },
    samples: [
        {
            inputs: { dirs: ["/base/", "tmp/", "test.txt"] },
            params: { method: "resolve" },
            result: { path: "/base/tmp/test.txt" },
        },
        {
            inputs: { dirs: ["base/", "tmp/", "test.txt"] },
            params: { method: "join" },
            result: { path: "base/tmp/test.txt" },
        },
        {
            inputs: { path: "base///tmp//test.txt" },
            params: { method: "normalize" },
            result: { path: "base/tmp/test.txt" },
        },
    ],
    description: "Path utils",
    category: ["fs"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = pathUtilsAgentInfo;
