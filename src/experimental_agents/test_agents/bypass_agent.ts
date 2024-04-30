import { AgentFunction } from "@/graphai";
import { AgentFunctionInfo } from "@/type";

export const bypassAgent: AgentFunction<{flat?: number, firstElement?: boolean}> = async ({params, inputs}) => {
  if (params.firstElement) {
    return inputs[0];
  }
  if (params.flat) {
    return inputs.flat(params.flat || 1)
  }
  return inputs;
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
