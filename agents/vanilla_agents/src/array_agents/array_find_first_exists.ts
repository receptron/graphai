import { AgentFunction, AgentFunctionInfo, isNull } from "graphai";
import { arrayValidate } from "@graphai/agent_utils";
import type { GraphAIArray } from "@graphai/agent_utils";

export const arrayFindFirstExistsAgent: AgentFunction<null, unknown, GraphAIArray> = async ({ namedInputs, params }) => {
  arrayValidate("arrayFindFirstExistsAgent", namedInputs);
  return namedInputs.array.find((item) => !isNull(item));
};

const arrayFindFirstExistsAgentInfo: AgentFunctionInfo = {
  name: "arrayFindFirstExistsAgent",
  agent: arrayFindFirstExistsAgent,
  mock: arrayFindFirstExistsAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "The array to be find",
      },
    },
    required: ["array"],
  },
  output: {
    type: "object",
  },
  params: {},
  samples: [
    {
      inputs: { array: [null, 2] },
      params: {},
      result: 2,
    },
    {
      inputs: { array: [undefined, null, 3] },
      params: {},
      result: 3,
    },
    {
      inputs: { array: [undefined, null, 0] },
      result: 0,
      params: {},
    },
  ],
  description: "Array Flat Agent",
  category: ["array"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_flat_agent.ts",
  package: "@graphai/vanilla",
  cacheType: "pureAgent",
  license: "MIT",
};
export default arrayFindFirstExistsAgentInfo;
