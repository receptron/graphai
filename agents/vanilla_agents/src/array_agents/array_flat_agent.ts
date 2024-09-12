import { AgentFunction, AgentFunctionInfo, assert } from "graphai";

export const arrayFlatAgent: AgentFunction<{ depth?: number }, Record<string, any>, Array<any>, { array: Array<unknown> }> = async ({
  namedInputs,
  params,
}) => {
  assert(!!namedInputs, "arrayFlatAgent: namedInputs is UNDEFINED!");
  const depth = params.depth ?? 1;

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
  params: {
    type: "object",
    properties: {
      depth: {
        type: "number",
        description: "array depth",
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
      inputs: { array: [[1], [2], [[3]]] },
      params: { depth: 2 },
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
