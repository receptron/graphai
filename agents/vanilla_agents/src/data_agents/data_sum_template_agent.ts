import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const dataSumTemplateAgent: AgentFunction<null, number, { array: number[] }> = async ({ namedInputs }) => {
  assert(isNamedInputs(namedInputs), "dataSumTemplateAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
  assert(!!namedInputs?.array, "dataSumTemplateAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");

  return namedInputs.array.reduce((tmp, input) => {
    return tmp + input;
  }, 0);
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
      result: 1,
    },
    {
      inputs: { array: [1, 2] },
      params: {},
      result: 3,
    },
    {
      inputs: { array: [1, 2, 3] },
      params: {},
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
