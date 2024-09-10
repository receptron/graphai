import { AgentFunction, AgentFunctionInfo, assert } from "graphai";

export const arrayFlatAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>, { array: Array<unknown>, depth?: number }> = async ({ namedInputs }) => {
  assert(!!namedInputs, "arrayFlatAgent: namedInputs is UNDEFINED!");
  const depth = namedInputs.depth ?? 1;
  
  const array = namedInputs.array.map((item: any) => item); // shallow copy
  return { array: array.flat(depth) };
};

const arrayFlatAgentInfo: AgentFunctionInfo = {
  name: "arrayFlatAgent",
  agent: arrayFlatAgent,
  mock: arrayFlatAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "flat array",
      },
    },
    required: ["array"],
  },
  output: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "the remaining array",
      },
    },
  },
  samples: [
    {
      inputs: { array: [[1], [2], [3]] },
      params: {},
      result: {
        array: [1, 2, 3],
      },
    },
    {
      inputs: { array: [[1], [2], [[3]]] },
      params: {},
      result: {
        array: [1, 2, [3]],
      },
    },
    {
      inputs: { array: [[1], [2], [[3]]], depth: 2 },
      params: {},
      result: {
        array: [1, 2, 3],
      },
    },
    {
      inputs: { array: [["a"], ["b"], ["c"]] },
      params: {},
      result: {
        array: ["a", "b", "c"],
      },
    },
  ],
  description: "Array Flat Agent",
  category: ["array"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default arrayFlatAgentInfo;
