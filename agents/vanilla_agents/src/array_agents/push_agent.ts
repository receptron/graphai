import { AgentFunction } from "graphai";

import assert from "node:assert";

export const pushAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>> = async ({ namedInputs }) => {
  assert(namedInputs, "namedInputs is UNDEFINED!");
  const { item } = namedInputs;  
  const array = namedInputs.array.map((item:any) => item); // shallow copy
  array.push(item);
  return array;
};

const pushAgentInfo = {
  name: "pushAgent",
  agent: pushAgent,
  mock: pushAgent,
  inputs: {
    properties: {
      array: {
        type: "array",
        description: "the array to push an item to",
      },
      item: {
        type: "any",
        description: "the item push into the array",
      },
    },
    required: ["array", "item"],
  },
  output: {
    type: "array"
  },
  samples: [
    {
      inputs: { array:[1, 2], item:3 },
      params: {},
      result: [1, 2, 3],
    },
    {
      inputs: { array:[{ apple: 1 }], item:{ lemon: 2 }},
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
