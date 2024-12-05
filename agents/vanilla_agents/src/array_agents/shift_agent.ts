import { AgentFunction, AgentFunctionInfo } from "graphai";
import { arrayValidate } from "@graphai/agent_utils";

export const shiftAgent: AgentFunction<Record<string, any>, Record<string, any>, { array: Array<unknown> }> = async ({ namedInputs }) => {
  arrayValidate("shiftAgent", namedInputs);

  const array = namedInputs.array.map((item: any) => item); // shallow copy
  const item = array.shift();
  return { array, item };
};

const shiftAgentInfo: AgentFunctionInfo = {
  name: "shiftAgent",
  agent: shiftAgent,
  mock: shiftAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "the array to shift an item from",
      },
    },
    required: ["array"],
  },
  output: {
    type: "object",
    properties: {
      item: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
        description: "the item shifted from the array",
      },
      array: {
        type: "array",
        description: "the remaining array",
      },
    },
  },
  samples: [
    {
      inputs: { array: [1, 2, 3] },
      params: {},
      result: {
        array: [2, 3],
        item: 1,
      },
    },
    {
      inputs: { array: ["a", "b", "c"] },
      params: {},
      result: {
        array: ["b", "c"],
        item: "a",
      },
    },
  ],
  description: "shift Agent",
  category: ["array"],
  cacheType: "pureAgent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default shiftAgentInfo;
