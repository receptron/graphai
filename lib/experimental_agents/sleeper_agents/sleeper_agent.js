"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleeperAgent = void 0;
const utils_1 = require("../../utils/utils");
const deepmerge_1 = __importDefault(require("deepmerge"));
const sleeperAgent = async (context) => {
    const { params, inputs } = context;
    await (0, utils_1.sleep)(params?.duration ?? 10);
    return inputs.reduce((result, input) => {
        return (0, deepmerge_1.default)(result, input);
    }, params.value ?? {});
};
exports.sleeperAgent = sleeperAgent;
const sleeperAgentInfo = {
    name: "sleeperAgent",
    agent: exports.sleeperAgent,
    mock: exports.sleeperAgent,
    samples: [],
    description: "sleeper Agent",
    category: ["sleeper"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = sleeperAgentInfo;
