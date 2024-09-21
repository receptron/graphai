"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataObjectMergeTemplateAgent = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const dataObjectMergeTemplateAgent = async ({ namedInputs }) => {
    return namedInputs.array.reduce((tmp, input) => {
        return (0, deepmerge_1.default)(tmp, input);
    }, {});
};
exports.dataObjectMergeTemplateAgent = dataObjectMergeTemplateAgent;
// for test and document
const sampleInputs = {
    array: [
        { a: 1, b: 1 },
        { a: 2, b: 2 },
        { a: 3, b: 0, c: 5 },
    ],
};
const sampleParams = {};
const sampleResult = { a: 3, b: 0, c: 5 };
const dataObjectMergeTemplateAgentInfo = {
    name: "dataObjectMergeTemplateAgent",
    agent: exports.dataObjectMergeTemplateAgent,
    mock: exports.dataObjectMergeTemplateAgent,
    samples: [
        {
            inputs: { array: [{ content1: "hello" }, { content2: "test" }] },
            params: {},
            result: {
                content1: "hello",
                content2: "test",
            },
        },
        {
            inputs: { array: [{ content1: "hello" }] },
            params: {},
            result: {
                content1: "hello",
            },
        },
        {
            inputs: { array: [{ content: "hello1" }, { content: "hello2" }] },
            params: {},
            result: {
                content: "hello2",
            },
        },
        {
            inputs: sampleInputs,
            params: sampleParams,
            result: sampleResult,
        },
        {
            inputs: { array: [{ a: { b: { c: { d: "e" } } } }, { b: { c: { d: { e: "f" } } } }, { b: { d: { e: { f: "g" } } } }] },
            params: {},
            result: {
                a: { b: { c: { d: "e" } } },
                b: {
                    c: { d: { e: "f" } },
                    d: { e: { f: "g" } },
                },
            },
        },
    ],
    description: "Merge object",
    category: ["data"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = dataObjectMergeTemplateAgentInfo;
