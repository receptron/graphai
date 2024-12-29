import OpenAI from "openai";
import { AgentFunction, AgentFunctionInfo } from "graphai";

import { GraphAILLMInputBase, getMergeValue } from "@graphai/llm_utils";

type OpenAIInputs = {
  model?: string;
} & GraphAILLMInputBase;

type OpenAIConfig = {
  baseURL?: string;
  apiKey?: string;
  forWeb?: boolean;
};

type OpenAIParams = OpenAIInputs & OpenAIConfig;

export const openAIImageAgent: AgentFunction<OpenAIParams, Record<string, any> | string, OpenAIInputs, OpenAIConfig> = async ({ params, namedInputs, config }) => {
  const { system, prompt } = { ...params, ...namedInputs };

  const { apiKey, baseURL, forWeb } = {
    ...params,
    ...(config ||{})
  };

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);
  const systemPrompt = getMergeValue(namedInputs, params, "mergeableSystem", system);

  const openai = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: !!forWeb });

  const chatParams = {
    model: params.model || "dall-e-3",
    prompt: [systemPrompt, userPrompt].filter((a) => a).join("\n"),
    n: 1,
    response_format: "url" as const,
    // size
    // style
  };
  // https://github.com/openai/openai-node/blob/master/src/resources/images.ts
  const response = await openai.images.generate(chatParams);

  // image_url = response.data[0].url
  // console.log(response.data);
  return response;
};

const openAIImageAgentInfo: AgentFunctionInfo = {
  name: "openAIImageAgent",
  agent: openAIImageAgent,
  mock: openAIImageAgent,
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
  environmentVariables: ["OPENAI_API_KEY"],
};

export default openAIImageAgentInfo;
