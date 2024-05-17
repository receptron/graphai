"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.textInputAgent = void 0;
const input_1 = __importDefault(require("@inquirer/input"));
const textInputAgent = async ({ params }) => {
    return await (0, input_1.default)({ message: params.message ?? "Enter" });
};
exports.textInputAgent = textInputAgent;
const textInputAgentInfo = {
    name: "textInputAgent",
    agent: exports.textInputAgent,
    mock: exports.textInputAgent,
    samples: [],
    description: "Text Input Agent",
    category: ["input"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = textInputAgentInfo;
