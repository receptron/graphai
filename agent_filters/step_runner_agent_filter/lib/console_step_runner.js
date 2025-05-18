"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleStepRunner = void 0;
const input_1 = __importDefault(require("@inquirer/input"));
const step_runner_generator_1 = require("./step_runner_generator");
const awaitStep = async (context, result) => {
    const { params, namedInputs, debugInfo } = context;
    const { nodeId, agentId, retry, state } = debugInfo;
    console.log({ nodeId, agentId, params, namedInputs, result, state, retry });
    const message = "Puress enter to next";
    await (0, input_1.default)({ message: message ?? "Next" });
};
exports.consoleStepRunner = (0, step_runner_generator_1.stepRunnerGenerator)(awaitStep);
