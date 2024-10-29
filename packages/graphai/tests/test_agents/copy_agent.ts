import { AgentFunction, AgentFunctionInfo } from "@/index";
import { isNamedInputs } from "@graphai/agent_utils";

export const copyAgent: AgentFunction<{ flat?: number; firstElement?: boolean; namedKey?: string }> = async ({ params, inputs, namedInputs }) => {
  const { namedKey } = params;
  if (namedKey) {
    return namedInputs[namedKey];
  }
  return namedInputs;
};

// for test and document
const copyAgentInfo: AgentFunctionInfo = {
  name: "copyAgent",
  agent: copyAgent,
  mock: copyAgent,
  samples: [
    {
      inputs: [{ a: "123" }],
      params: {},
      result: [{ a: "123" }],
    },
    {
      inputs: [
        [{ a: "123" }, { b: "abc" }],
        [{ c: "987" }, { d: "xyz" }],
      ],
      params: {},
      result: [
        [{ a: "123" }, { b: "abc" }],
        [{ c: "987" }, { d: "xyz" }],
      ],
    },
    {
      inputs: [
        [{ a: "123" }, { b: "abc" }],
        [{ c: "987" }, { d: "xyz" }],
      ],
      params: { firstElement: true },
      result: [{ a: "123" }, { b: "abc" }],
    },
    {
      inputs: [
        [{ a: "123" }, { b: "abc" }],
        [{ c: "987" }, { d: "xyz" }],
      ],
      params: { flat: 1 },
      result: [{ a: "123" }, { b: "abc" }, { c: "987" }, { d: "xyz" }],
    },
  ],
  description: "copy agent",
  category: ["test"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default copyAgentInfo;
