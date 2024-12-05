"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepAndMergeAgent = void 0;
const graphai_1 = require("graphai");
const deepmerge_1 = __importDefault(require("deepmerge"));
// import { isNamedInputs } from "@graphai/agent_utils";
const sleepAndMergeAgent = async ({ params, namedInputs }) => {
    await (0, graphai_1.sleep)(params?.duration ?? 10);
    return (namedInputs.array ?? []).reduce((result, input) => {
        return (0, deepmerge_1.default)(result, input);
    }, params.value ?? {});
};
exports.sleepAndMergeAgent = sleepAndMergeAgent;
const sleeperAndMergeInfo = {
    name: "sleepAndMergeAgent",
    agent: exports.sleepAndMergeAgent,
    mock: exports.sleepAndMergeAgent,
    samples: [
        {
            inputs: {},
            params: { duration: 1 },
            result: {},
        },
        {
            inputs: { array: [{ a: 1 }, { b: 2 }] },
            params: { duration: 1 },
            result: {
                a: 1,
                b: 2,
            },
        },
    ],
    description: "sleeper and merge Agent",
    category: ["sleeper"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = sleeperAndMergeInfo;
