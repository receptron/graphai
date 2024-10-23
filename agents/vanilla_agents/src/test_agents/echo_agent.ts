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
      params: { message: "this is test" },
      result: { message: "this is test" },
    },
    {
      inputs: {},
      params: {
        message: "If you add filterParams option, it will respond to filterParams",
        filterParams: true,
      },
      result: {},
    },
  ],
  description: "Echo agent",
  category: ["test"],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default echoAgentInfo;
