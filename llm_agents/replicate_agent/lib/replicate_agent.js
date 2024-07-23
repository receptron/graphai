"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replicateAgent = void 0;
const replicate_1 = __importDefault(require("replicate"));
const llm_utils_1 = require("@graphai/llm_utils");
const replicateAgent = async ({ filterParams, params, namedInputs, }) => {
    const { verbose, system, baseURL, apiKey, stream, prompt, messages, forWeb } = {
        ...params,
        ...namedInputs,
    };
    const userPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeablePrompts", prompt);
    const systemPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeableSystem", system);
    const replicate = new replicate_1.default();
    const output = await replicate.run(params.model, { input: { prompt: userPrompt } });
    return { choices: [{ message: { role: "assistant", content: output.join("") } }] };
};
exports.replicateAgent = replicateAgent;
const replicateAgentInfo = {
    name: "replicateAgent",
    agent: exports.replicateAgent,
    mock: exports.replicateAgent,
    inputs: {},
    output: {},
    params: {},
    outputFormat: {},
    samples: [],
    description: "Replicate Agent",
    category: ["llm"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
    stream: false,
    npms: ["replicate"],
};
exports.default = replicateAgentInfo;
