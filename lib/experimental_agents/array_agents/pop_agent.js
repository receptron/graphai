"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.popAgent = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const popAgent = async (context) => {
    const { inputs } = context;
    const [array] = (0, deepmerge_1.default)({ inputs }, {}).inputs;
    // TODO: Validation
    const item = array.pop();
    return { array, item };
};
exports.popAgent = popAgent;
const popAgentInfo = {
    name: "popAgent",
    agent: exports.popAgent,
    mock: exports.popAgent,
    samples: [
        {
            inputs: [[1, 2, 3]],
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
        {
            inputs: [["a", "b", "c"]],
            params: {},
            result: {
                array: ["a", "b"],
                item: "c",
            },
        },
        {
            inputs: [
                [1, 2, 3],
                ["a", "b", "c"],
            ],
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
    ],
    description: "Pop Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = popAgentInfo;
