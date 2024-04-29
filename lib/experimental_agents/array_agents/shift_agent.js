"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftAgent = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const shiftAgent = async (context) => {
    const { inputs } = context;
    const [array] = (0, deepmerge_1.default)({ inputs }, {}).inputs;
    // TODO: Validation
    const item = array.shift();
    return { array, item };
};
exports.shiftAgent = shiftAgent;
const shiftAgentInfo = {
    name: "shiftAgent",
    agent: exports.shiftAgent,
    mock: exports.shiftAgent,
    samples: [
        {
            inputs: [[1, 2, 3]],
            params: {},
            result: {
                array: [2, 3],
                item: 1,
            },
        },
        {
            inputs: [["a", "b", "c"]],
            params: {},
            result: {
                array: ["b", "c"],
                item: "a",
            },
        },
    ],
    description: "shift Agent",
    category: [],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = shiftAgentInfo;
