import Replicate from "replicate";
import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAILLMInputBase, getMergeValue } from "@graphai/llm_utils";
import type { GraphAIMessagePayload, GraphAIText, GraphAIMessage } from "@graphai/agent_utils";

type ReplicateInputs = {
  model?: string;
  verbose?: boolean;
  baseURL?: string;
  apiKey?: string;
  // stream?: boolean;
  messages?: Array<Record<string, any>>;
  forWeb?: boolean;
} & GraphAILLMInputBase;

type ReplicateResult = GraphAIText & GraphAIMessage & { choices: Array<GraphAIMessage> };

export const replicateAgent: AgentFunction<ReplicateInputs, ReplicateResult, ReplicateInputs> = async ({ params, namedInputs }) => {
  const { prompt } = {
    ...params,
    ...namedInputs,
  };

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);

  const replicate = new Replicate();

  const output = await replicate.run(params.model as any, { input: { prompt: userPrompt as any } });

  const content = (output as string[]).join("");
  const message: GraphAIMessagePayload = { role: "assistant", content };
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
  source: "https://github.com/receptron/graphai/blob/main/llm_agents/replicate_agent/src/replicate_agent.ts",
  package: "@graphai/replicate_agent",
  license: "MIT",
  stream: false,
  npms: ["replicate"],
  environmentVariables: ["REPLICATE_API_TOKEN"],
};

export default replicateAgentInfo;
