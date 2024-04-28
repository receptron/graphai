import { AgentFunction } from "@/graphai";
import deepmerge from "deepmerge";

export const popAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>> = async (context) => {
  const { inputs } = context;
  const [array] = deepmerge({ inputs }, {}).inputs;
  // TODO: Validation
  const item = array.pop();
  return { array, item };
};

const popAgentInfo = {
  name: "popAgent",
  agent: popAgent,
  mock: popAgent,
  samples: [],
  description: "pop Agent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default popAgentInfo;
