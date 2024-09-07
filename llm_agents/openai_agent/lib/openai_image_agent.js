"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAIImageAgent = exports.getMergeValue = exports.flatString = void 0;
const openai_1 = __importDefault(require("openai"));
// export for test
const flatString = (input) => {
    return Array.isArray(input) ? input.filter((a) => a).join("\n") : (input ?? "");
};
exports.flatString = flatString;
// export for test
const getMergeValue = (namedInputs, params, key, values) => {
    const inputValue = namedInputs[key];
    const paramsValue = params[key];
    return inputValue || paramsValue ? [(0, exports.flatString)(inputValue), (0, exports.flatString)(paramsValue)].filter((a) => a).join("\n") : (0, exports.flatString)(values);
};
exports.getMergeValue = getMergeValue;
const openAIImageAgent = async ({ params, namedInputs, }) => {
    const { system, baseURL, apiKey, prompt, forWeb } = { ...params, ...namedInputs };
    const userPrompt = (0, exports.getMergeValue)(namedInputs, params, "mergeablePrompts", prompt);
    const systemPrompt = (0, exports.getMergeValue)(namedInputs, params, "mergeableSystem", system);
    const openai = new openai_1.default({ apiKey, baseURL, dangerouslyAllowBrowser: !!forWeb });
    const chatParams = {
        model: params.model || "dall-e-3",
        prompt: [systemPrompt, userPrompt].filter((a) => a).join("\n"),
        n: 1,
        response_format: "url",
        // size
        // style
    };
    // https://github.com/openai/openai-node/blob/master/src/resources/images.ts
    const response = await openai.images.generate(chatParams);
    // image_url = response.data[0].url
    // console.log(response.data);
    return response;
};
exports.openAIImageAgent = openAIImageAgent;
const openAIImageAgentInfo = {
    name: "openAIImageAgent",
    agent: exports.openAIImageAgent,
    mock: exports.openAIImageAgent,
    inputs: {},
    output: {},
    params: {},
    outputFormat: {},
    samples: [],
    description: "OpenAI Image Agent",
    category: ["llm"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
    stream: false,
    npms: ["openai"],
    environmentVariables: ["OPENAI_API_KEY"]
};
exports.default = openAIImageAgentInfo;
