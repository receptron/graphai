import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const copyAgent: AgentFunction = async ({ namedInputs }) => {
  assert(isNamedInputs(namedInputs), "copyAgent: namedInputs is UNDEFINED!");

  return namedInputs;
};

const copyAgentInfo: AgentFunctionInfo = {
  name: "copyAgent",
  agent: copyAgent,
  mock: copyAgent,
  inputs: {
    anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
  },
  output: {
    anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
  },
  samples: [
    {
      inputs: { color: "red", model: "Model 3" },
      params: {},
      result: { color: "red", model: "Model 3" },
    },
    {
      inputs: { array: ["Hello World", "Discarded"] },
      params: {},
      result: { array: ["Hello World", "Discarded"] },
    },
  ],
  description: "Returns namedInputs",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default copyAgentInfo;
