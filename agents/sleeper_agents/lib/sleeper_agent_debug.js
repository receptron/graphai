"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleeperAgentDebug = void 0;
const graphai_1 = require("graphai");
const deepmerge_1 = __importDefault(require("deepmerge"));
// import { isNamedInputs } from "@graphai/agent_utils";
const sleeperAgentDebug = async ({ params, namedInputs, debugInfo: { retry }, }) => {
    await (0, graphai_1.sleep)(params.duration / (retry + 1));
    if (params.fail && retry < 2) {
        // console.log("failed (intentional)", nodeId, retry);
        throw new Error(graphai_1.strIntentionalError);
    }
    return (namedInputs.array ?? []).reduce((result, input) => {
        return (0, deepmerge_1.default)(result, input);
    }, params.value ?? {});
};
exports.sleeperAgentDebug = sleeperAgentDebug;
const sleeperAgentDebugInfo = {
    name: "sleeperAgentDebug",
    agent: exports.sleeperAgentDebug,
    mock: exports.sleeperAgentDebug,
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
    description: "sleeper debug Agent",
    category: ["sleeper"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = sleeperAgentDebugInfo;
