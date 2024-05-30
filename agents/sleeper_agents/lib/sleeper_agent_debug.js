"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleeperAgentDebug = void 0;
const graphai_1 = require("graphai");
const utils_1 = require("graphai/lib/utils/utils");
const deepmerge_1 = __importDefault(require("deepmerge"));
const sleeperAgentDebug = async ({ params, inputs, debugInfo: { retry }, }) => {
    await (0, utils_1.sleep)(params.duration / (retry + 1));
    if (params.fail && retry < 2) {
        // console.log("failed (intentional)", nodeId, retry);
        throw new Error(graphai_1.strIntentionalError);
    }
    return inputs.reduce((result, input) => {
        return (0, deepmerge_1.default)(result, input);
    }, params.value ?? {});
};
exports.sleeperAgentDebug = sleeperAgentDebug;
const sleeperAgentDebugInfo = {
    name: "sleeperAgentDebug",
    agent: exports.sleeperAgentDebug,
    mock: exports.sleeperAgentDebug,
    samples: [],
    description: "sleeper debug Agent",
    category: ["sleeper"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = sleeperAgentDebugInfo;
