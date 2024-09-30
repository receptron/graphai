"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleeperAgent = void 0;
const graphai_1 = require("graphai");
const deepmerge_1 = __importDefault(require("deepmerge"));
const agent_utils_1 = require("@graphai/agent_utils");
const sleeperAgent = async ({ params, inputs, namedInputs }) => {
    await (0, graphai_1.sleep)(params?.duration ?? 10);
    return ((0, agent_utils_1.isNamedInputs)(namedInputs) ? namedInputs.array : inputs).reduce((result, input) => {
        return (0, deepmerge_1.default)(result, input);
    }, params.value ?? {});
};
exports.sleeperAgent = sleeperAgent;
const sleeperAgentInfo = {
    name: "sleeperAgent",
    agent: exports.sleeperAgent,
    mock: exports.sleeperAgent,
    samples: [
        {
            inputs: {},
            params: { duration: 1 },
            result: {},
        },
        {
            inputs: [{ a: 1 }, { b: 2 }],
            params: { duration: 1 },
            result: {
                a: 1,
                b: 2,
            },
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
    description: "sleeper Agent",
    category: ["sleeper"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = sleeperAgentInfo;
