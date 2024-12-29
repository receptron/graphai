import { AgentFunction, AgentFunctionInfo } from "@/index";

export const copyConfigAgent: AgentFunction<{ namedKey?: string }> = async ({ params, config }) => {
  const { namedKey } = params;
  if (namedKey && config) {
    return config[namedKey];
  }
  return config;
};

// for test and document
const copyConfigAgentInfo: AgentFunctionInfo = {
  name: "copyConfigAgent",
  agent: copyConfigAgent,
  mock: copyConfigAgent,
  samples: [],
  description: "copy config agent",
  category: ["test"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default copyConfigAgentInfo;
