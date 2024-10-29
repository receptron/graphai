import { AgentFunction, AgentFunctionInfo } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const bypassAgent: AgentFunction<{
  flat?: number;
  firstElement?: boolean;
  namedKey?: string;
}> = async ({ params, inputs, namedInputs }) => {
  console.warn(`bypassAgent have been deprecated. replace bypassAgent to copyAgent`);
  const { flat, firstElement, namedKey } = params;
  if (isNamedInputs(namedInputs)) {
    if (namedKey) {
      return namedInputs[namedKey];
    }
    return namedInputs;
  }
  if (params && firstElement) {
    return inputs[0];
  }
  if (params && flat) {
    return inputs.flat(flat || 1);
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
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default bypassAgentInfo;
