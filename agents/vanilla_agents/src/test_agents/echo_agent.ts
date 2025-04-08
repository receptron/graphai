import { AgentFunction, AgentFunctionInfo } from "graphai";

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
  samples: [
    {
      inputs: {},
      params: { text: "this is test" },
      result: { text: "this is test" },
    },
    {
      inputs: {},
      params: {
        text: "If you add filterParams option, it will respond to filterParams",
        filterParams: true,
      },
      result: {},
    },
  ],
  description: "Echo agent",
  category: ["test"],
  cacheType: "pureAgent",
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/echo_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};

export default echoAgentInfo;
