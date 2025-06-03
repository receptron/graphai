import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const mergeObjectAgent: AgentFunction<null, Record<string, any>, { items: Record<string, any> }> = async ({ namedInputs }) => {
  assert(isNamedInputs(namedInputs), "mergeObjectAgent: namedInputs is UNDEFINED!");
  const { items } = namedInputs;
  assert(items !== undefined && Array.isArray(items), "mergeObjectAgent: namedInputs.items is not array!");

  return Object.assign({}, ...items);
};

const mergeObjectAgentInfo: AgentFunctionInfo = {
  name: "mergeObjectAgent",
  agent: mergeObjectAgent,
  mock: mergeObjectAgent,
  inputs: {
    type: "object",
    properties: {
      items: {
        type: "array",
        description: "An array of objects whose key-value pairs will be merged into a single object. Later objects override earlier ones on key conflict.",
        items: {
          type: "object",
          description: "An individual object contributing to the merged result.",
        },
      },
    },
    required: ["items"],
    additionalProperties: false,
  },
  params: {
    type: "object",
    description: "This agent does not take any parameters. The object must be empty.",
    properties: {},
    additionalProperties: false,
  },
  output: {
    anyOf: { type: "object" },
  },
  samples: [
    {
      inputs: { items: [{ color: "red" }, { model: "Model 3" }] },
      params: {},
      result: { color: "red", model: "Model 3" },
    },
  ],
  description: "Returns namedInputs",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/merge_objects_agent.ts",

  package: "@graphai/vanilla",
  license: "MIT",
};
export default mergeObjectAgentInfo;
