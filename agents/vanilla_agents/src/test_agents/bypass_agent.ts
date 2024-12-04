import { AgentFunction, AgentFunctionInfo } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const bypassAgent: AgentFunction<{
  namedKey?: string;
}> = async ({ params, namedInputs }) => {
  console.warn(`bypassAgent have been deprecated. replace bypassAgent to copyAgent`);
  const { namedKey } = params;
  if (namedKey) {
    return namedInputs[namedKey];
  }
  return namedInputs;
};

// for test and document
const bypassAgentInfo: AgentFunctionInfo = {
  name: "bypassAgent",
  agent: bypassAgent,
  mock: bypassAgent,
  samples: [
    {
      inputs: { a: "123" },
      params: {},
      result: { a: "123" },
    },
    {
      inputs: {
        array: [
          [{ a: "123" }, { b: "abc" }],
          [{ c: "987" }, { d: "xyz" }],
        ],
      },
      params: {},
      result: {
        array: [
          [{ a: "123" }, { b: "abc" }],
          [{ c: "987" }, { d: "xyz" }],
        ],
      },
    },
    // named
    {
      inputs: { a: "123", b: "abc", c: "987", d: "xyz" },
      params: {},
      result: { a: "123", b: "abc", c: "987", d: "xyz" },
    },
  ],
  description: "bypass agent",
  category: ["test"],
  cacheType: "pureAgent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default bypassAgentInfo;
