import Replicate from "replicate";
import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GrapAILLMInputBase, getMergeValue } from "@graphai/llm_utils";

type ReplicateInputs = {
  model?: string;
  verbose?: boolean;
  baseURL?: string;
  apiKey?: string;
  // stream?: boolean;
  messages?: Array<Record<string, any>>;
  forWeb?: boolean;
} & GrapAILLMInputBase;

export const replicateAgent: AgentFunction<ReplicateInputs, Record<string, any> | string, ReplicateInputs> = async ({ params, namedInputs }) => {
  const { prompt } = {
    ...params,
    ...namedInputs,
  };

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);

  const replicate = new Replicate();

  const output = await replicate.run(params.model as any, { input: { prompt: userPrompt as any } });

  const content = (output as string[]).join("");
  const message = { role: "assistant", content };
  return { choices: [{ message }], text: content, message };
};

const replicateAgentInfo: AgentFunctionInfo = {
  name: "replicateAgent",
  agent: replicateAgent,
  mock: replicateAgent,
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
  environmentVariables: ["REPLICATE_API_TOKEN"],
};

export default replicateAgentInfo;
