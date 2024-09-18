import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const pushAgent: AgentFunction<null, Array<unknown>, null, { array: Array<unknown>; item?: unknown; items: Array<unknown> }> = async ({
  namedInputs,
}) => {
  assert(isNamedInputs(namedInputs), "pushAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
  const { item, items } = namedInputs;
  assert(!!(item || items), "pushAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");

  const array = namedInputs.array.map((item: any) => item); // shallow copy
  array.push(item);
  return array;
};

const pushAgentInfo: AgentFunctionInfo = {
  name: "pushAgent",
  agent: pushAgent,
  mock: pushAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "the array to push an item to",
      },
      item: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
        description: "the item push into the array",
      },
    },
    required: ["array", "item"],
  },
  output: {
    type: "array",
  },
  samples: [
    {
      inputs: { array: [1, 2], item: 3 },
      params: {},
      result: [1, 2, 3],
    },
    {
      inputs: { array: [{ apple: 1 }], item: { lemon: 2 } },
      params: {},
      result: [{ apple: 1 }, { lemon: 2 }],
    },
  ],
  description: "push Agent",
  category: ["array"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default pushAgentInfo;
