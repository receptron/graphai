import { AgentFunction } from "@/graphai";
import deepmerge from "deepmerge";

export const pushAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>> = async ({ inputs }) => {
  const [array, item] = deepmerge({ inputs }, {}).inputs;
  // TODO: Validation
  array.push(item);
  return array;
};

const pushAgentInfo = {
  name: "pushAgent",
  agent: pushAgent,
  mock: pushAgent,
  samples: [],
  description: "push Agent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default pushAgentInfo;
