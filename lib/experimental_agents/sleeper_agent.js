"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleeperAgentDebug = exports.sleeperAgent = void 0;
const utils_1 = require("../utils/utils");
const deepmerge_1 = __importDefault(require("deepmerge"));
const sleeperAgent = async (context) => {
    const { params, inputs } = context;
    await (0, utils_1.sleep)(params.duration);
    return inputs.reduce((result, input) => {
        return (0, deepmerge_1.default)(result, input);
    }, params.value ?? {});
};
exports.sleeperAgent = sleeperAgent;
const sleeperAgentDebug = async (context) => {
    const { params, inputs, retry } = context;
    await (0, utils_1.sleep)(params.duration / (retry + 1));
    if (params.fail && retry < 2) {
        // console.log("failed (intentional)", nodeId, retry);
        throw new Error("Intentional Failure");
    }
    return inputs.reduce((result, input) => {
        return (0, deepmerge_1.default)(result, input);
    }, params.value ?? {});
};
exports.sleeperAgentDebug = sleeperAgentDebug;
