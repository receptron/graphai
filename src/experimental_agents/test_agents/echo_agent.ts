import { AgentFunction } from "@/graphai";

export const echoAgent: AgentFunction = async ({ params }) => {
  return params;
};

// for test and document
const echoAgentInfo = {
  name: "echoAgent",
  agent: echoAgent,
  mock: echoAgent,
  samples: [{}],
  description: "Echo agent",
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default echoAgentInfo;
