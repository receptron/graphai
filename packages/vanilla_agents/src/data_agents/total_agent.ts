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

// for test and document
const sampleInputs = [{ a: 1 }, { a: 2 }, { a: 3 }];
const sampleParams = {};
const sampleResult = { a: 6 };

const sample2Inputs = [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]];
const sample2Params = {};
const sample2Result = { a: 6, b: -4, c: 10, d: -10 };

//
const totalAgentInfo = {
  name: "totalAgent",
  agent: totalAgent,
  mock: totalAgent,
  samples: [
    {
      inputs: sampleInputs,
      params: sampleParams,
      result: sampleResult,
    },
    {
      inputs: sample2Inputs,
      params: sample2Params,
      result: sample2Result,
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
