import { AgentFunction } from "@/graphai";
import { AgentFunctionInfo } from "@/type";

export const echoAgent: AgentFunction = async ({ params }) => {
  return params;
};

// for test and document
const echoAgentInfo: AgentFunctionInfo = {
  name: "echoAgent",
  agent: echoAgent,
  mock: echoAgent,
  samples: [],
  description: "Echo agent",
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default echoAgentInfo;
