"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.textInputAgent = void 0;
const input_1 = __importDefault(require("@inquirer/input"));
const textInputAgent = async ({ params }) => {
    const { message, required, role } = params;
    while (true) {
        const text = await (0, input_1.default)({ message: message ?? "Enter" });
        // console.log(!required,  (text ?? '' !== ''), required);
        if (!required || (text ?? "") !== "") {
            return {
                text,
                message: {
                    role: role ?? "user",
                    content: text,
                },
            };
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
            inputs: {},
            params: { message: "Enter your message to AI." },
            result: {
                text: "message from the user",
                content: {
                    role: "user",
                    content: "message from the user",
                },
            },
        },
        {
            inputs: {},
            params: { message: "Enter your message to AI.", role: "system" },
            result: {
                text: "message from the user",
                content: {
                    role: "system",
                    content: "message from the user",
                },
            },
        },
    ],
    description: "Text Input Agent",
    category: ["input"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = textInputAgentInfo;
