import { AgentFunction } from "@/graphai";
import { AgentFunctionInfo } from "@/type";

export const bypassAgent: AgentFunction = async (context) => {
  return context.inputs;
};

// for test and document
const bypassAgentInfo: AgentFunctionInfo = {
  name: "bypassAgent",
  agent: bypassAgent,
  mock: bypassAgent,
  samples: [
    {
      inputs: [{ a: "123" }],
      params: {},
      result: [{ a: "123" }],
    },
    {
      inputs: [{ a: "123" }, { b: "abc" }],
      params: {},
      result: [{ a: "123" }, { b: "abc" }],
    },
  ],
  description: "bypass agent",
  category: [],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default bypassAgentInfo;
