import { AgentFunction, AgentFunctionInfo } from "graphai";
import { arrayValidate } from "@graphai/agent_utils";

export const arrayFlatAgent: AgentFunction<{ depth?: number }, { array: Array<unknown> }, { array: Array<unknown> }> = async ({ namedInputs, params }) => {
  arrayValidate("arrayFlatAgent", namedInputs);
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
  cacheType: "pureAgent",
  license: "MIT",
};
export default arrayFlatAgentInfo;
