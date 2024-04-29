import { AgentFunction } from "@/graphai";
import deepmerge from "deepmerge";

export const dataObjectMergeTemplateAgent: AgentFunction = async ({ inputs }) => {
  return inputs.reduce((tmp, input) => {
    return deepmerge(tmp, input);
  }, {});
};

// for test and document
const sampleInputs = [
  { a: 1, b: 1 },
  { a: 2, b: 2 },
  { a: 3, b: 0, c: 5 },
];
const sampleParams = {};
const sampleResult = { a: 6, b: 3 };

const dataObjectMergeTemplateAgentInfo = {
  name: "dataObjectMergeTemplateAgent",
  agent: dataObjectMergeTemplateAgent,
  mock: dataObjectMergeTemplateAgent,
  samples: [
    {
      inputs: sampleInputs,
      params: sampleParams,
      result: sampleResult,
    },
  ],
  description: "Merge object",
  category: [],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default dataObjectMergeTemplateAgentInfo;
