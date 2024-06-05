import { AgentFunction } from "graphai";

import assert from "node:assert";

export const shiftAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>> = async ({ namedInputs }) => {
  assert(namedInputs, "shiftAgent: namedInputs is UNDEFINED!");
  const array = namedInputs.array.map((item: any) => item); // shallow copy
  const item = array.shift();
  return { array, item };
};

const shiftAgentInfo = {
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
        type: "any",
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
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default shiftAgentInfo;
