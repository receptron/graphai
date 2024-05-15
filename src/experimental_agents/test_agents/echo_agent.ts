import { AgentFunction, AgentFunctionInfo } from "@/index";

export const echoAgent: AgentFunction = async ({ params, filterParams }) => {
  if (params.filterParams) {
    return filterParams;
  }
  return params;
};

// for test and document
const echoAgentInfo: AgentFunctionInfo = {
  name: "echoAgent",
  agent: echoAgent,
  mock: echoAgent,
  samples: [],
  description: "Echo agent",
  category: [],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default echoAgentInfo;
