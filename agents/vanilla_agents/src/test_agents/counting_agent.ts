import { AgentFunction, AgentFunctionInfo } from "graphai";

export const countingAgent: AgentFunction<{ count: number }, { list: number[] }> = async ({ params }) => {
  return {
    list: new Array(params.count).fill(undefined).map((_, i) => {
      return i;
    }),
  };
};

// for test and document
const countingAgentInfo: AgentFunctionInfo = {
  name: "countingAgent",
  agent: countingAgent,
  mock: countingAgent,
  samples: [
    {
      inputs: {},
      params: { count: 4 },
      result: { list: [0, 1, 2, 3] },
    },
  ],
  description: "Counting agent",
  category: ["test"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default countingAgentInfo;
