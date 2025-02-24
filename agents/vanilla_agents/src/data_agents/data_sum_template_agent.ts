import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const dataSumTemplateAgent: AgentFunction<{ flatResponse?: boolean }, number | { result: number }, { array: number[] }> = async ({
  namedInputs,
  params,
}) => {
  const { flatResponse } = params;

  assert(isNamedInputs(namedInputs), "dataSumTemplateAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
  assert(!!namedInputs?.array, "dataSumTemplateAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");

  const sum = namedInputs.array.reduce((tmp, input) => {
    return tmp + input;
  }, 0);
  if (flatResponse) {
    return sum;
  }
  return { result: sum };
};

const dataSumTemplateAgentInfo: AgentFunctionInfo = {
  name: "dataSumTemplateAgent",
  agent: dataSumTemplateAgent,
  mock: dataSumTemplateAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "the array of numbers to calculate the sum of",
        items: {
          type: "integer",
        },
      },
    },
    required: ["array"],
  },
  output: {
    type: "number",
  },
  samples: [
    {
      inputs: { array: [1] },
      params: {},
      result: { result: 1 },
    },
    {
      inputs: { array: [1, 2] },
      params: {},
      result: { result: 3 },
    },
    {
      inputs: { array: [1, 2, 3] },
      params: {},
      result: { result: 6 },
    },

    {
      inputs: { array: [1] },
      params: { flatResponse: true },
      result: 1,
    },
    {
      inputs: { array: [1, 2] },
      params: { flatResponse: true },
      result: 3,
    },
    {
      inputs: { array: [1, 2, 3] },
      params: { flatResponse: true },
      result: 6,
    },
  ],
  description: "Returns the sum of input values",
  category: ["data"],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default dataSumTemplateAgentInfo;
