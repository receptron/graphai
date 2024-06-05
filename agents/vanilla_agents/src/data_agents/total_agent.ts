import { AgentFunction } from "graphai";

export const totalAgent: AgentFunction<Record<never, never>, Record<string, number>> = async ({ inputs }) => {
  return inputs.reduce((result, input) => {
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
const totalAgentInfo = {
  name: "totalAgent",
  agent: totalAgent,
  mock: totalAgent,
  inputs: {
    type: "array",
  },
  output: {
    type: "any",
  },
  samples: [
    {
      inputs: [{ a: 1 }, { a: 2 }, { a: 3 }],
      params: {},
      result: { a: 6 },
    },
    {
      inputs: [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]],
      params: {},
      result: { a: 6, b: -4, c: 10, d: -10 },
    },
    {
      inputs: [{ a: 1 }],
      params: {},
      result: { a: 1 },
    },
    {
      inputs: [{ a: 1 }, { a: 2 }],
      params: {},
      result: { a: 3 },
    },
    {
      inputs: [{ a: 1 }, { a: 2 }, { a: 3 }],
      params: {},
      result: { a: 6 },
    },
    {
      inputs: [
        { a: 1, b: 1 },
        { a: 2, b: 2 },
        { a: 3, b: 0 },
      ],
      params: {},
      result: { a: 6, b: 3 },
    },
    {
      inputs: [{ a: 1 }, { a: 2, b: 2 }, { a: 3, b: 0 }],
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
