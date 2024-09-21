import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const totalAgent: AgentFunction<Record<never, never>, Record<string, number>, null, { array: Record<string, number>[] }> = async ({ namedInputs }) => {
  assert(isNamedInputs(namedInputs), "totalAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
  assert(!!(namedInputs?.array), "totalAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");

  return namedInputs.array.reduce((result, input) => {
    const inputArray = Array.isArray(input) ? input : [input];
    inputArray.forEach((innerInput) => {
      Object.keys(innerInput).forEach((key) => {
        const value = innerInput[key];
        if (result[key]) {
          result[key] += value;
        } else {
          result[key] = value;
        }
      });
    });
    return result;
  }, {});
};

//
const totalAgentInfo: AgentFunctionInfo = {
  name: "totalAgent",
  agent: totalAgent,
  mock: totalAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "the array",
      },
    },
    required: ["array"],
  },
  output: {
    type: "object",
  },
  samples: [
    {
      inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
      params: {},
      result: { a: 6 },
    },
    {
      inputs: { array: [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]] },
      params: {},
      result: { a: 6, b: -4, c: 10, d: -10 },
    },
    {
      inputs: { array: [{ a: 1 }] },
      params: {},
      result: { a: 1 },
    },
    {
      inputs: { array: [{ a: 1 }, { a: 2 }] },
      params: {},
      result: { a: 3 },
    },
    {
      inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
      params: {},
      result: { a: 6 },
    },
    {
      inputs: {
        array: [
          { a: 1, b: 1 },
          { a: 2, b: 2 },
          { a: 3, b: 0 },
        ],
      },
      params: {},
      result: { a: 6, b: 3 },
    },
    {
      inputs: { array: [{ a: 1 }, { a: 2, b: 2 }, { a: 3, b: 0 }] },
      params: {},
      result: { a: 6, b: 2 },
    },
  ],
  description: "Returns the sum of input values",
  category: ["data"],
  author: "Satoshi Nakajima",
  repository: "https://github.com/snakajima/graphai",
  license: "MIT",
};
export default totalAgentInfo;
