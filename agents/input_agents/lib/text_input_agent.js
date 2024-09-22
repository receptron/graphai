"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.textInputAgent = void 0;
const input_1 = __importDefault(require("@inquirer/input"));
const textInputAgent = async ({ params }) => {
    const { message, required } = params;
    while (true) {
        const result = await (0, input_1.default)({ message: message ?? "Enter" });
        // console.log(!required,  (result ?? '' !== ''), required);
        if (!required || (result ?? "") !== "") {
            return result;
        }
    }
};
exports.textInputAgent = textInputAgent;
const textInputAgentInfo = {
    name: "textInputAgent",
    agent: exports.textInputAgent,
    mock: exports.textInputAgent,
    samples: [
        {
            inputs: [],
            params: { message: "Enter your message to AI." },
            result: "message from the user",
        },
    ],
    description: "Text Input Agent",
    category: ["input"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = textInputAgentInfo;
