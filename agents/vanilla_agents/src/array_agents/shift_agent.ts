import { AgentFunction } from "graphai";

import assert from "node:assert";

export const shiftAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>> = async (context) => {
  const { namedInputs } = context;
  assert(namedInputs, "namedInputs is UNDEFINED!");
  const { array } = namedInputs;
  const arrayCopy = array.map((item: any) => item); // shallow copy
  const item = arrayCopy.shift();
  return { array: arrayCopy, item };
};

const shiftAgentInfo = {
  name: "shiftAgent",
  agent: shiftAgent,
  mock: shiftAgent,
  inputs: {
    properties: {
      array: {
        type: "array",
        description: "the array to shift an item from",
      },
    },
    required: ["array"],
  },
  output: {
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
      inputs: { array:["a", "b", "c"] },
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
