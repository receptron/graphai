import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";
import type { GraphAIItems } from "@graphai/agent_utils";

export const arrayToObjectAgent: AgentFunction<{ key: string }, GraphAIItems, Record<string, any>> = async ({ params, namedInputs }) => {
  assert(isNamedInputs(namedInputs), "arrayToObjectAgent: namedInputs is UNDEFINED!");
  const { items } = namedInputs;
  const { key } = params;

  assert(items !== undefined && Array.isArray(items), "arrayToObjectAgent: namedInputs.items is not array!");
  assert(key !== undefined && key !== null, "arrayToObjectAgent: params.key is UNDEFINED!");

  return namedInputs.items.reduce((tmp: Record<string, any>, current: Record<string, any>) => {
    tmp[current[key]] = current;
    return tmp;
  }, {});
};

const arrayToObjectAgentInfo: AgentFunctionInfo = {
  name: "arrayToObjectAgent",
  agent: arrayToObjectAgent,
  mock: arrayToObjectAgent,
  inputs: {
    type: "object",
    properties: {
      items: {
        type: "array",
        description: "the array to pop an item from",
      },
    },
    required: ["items"],
  },
  output: {
    type: "object",
    properties: {
      anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
      description: "the item popped from the array",
    },
  },
  samples: [
    {
      inputs: {
        items: [
          { id: 1, data: "a" },
          { id: 2, data: "b" },
        ],
      },
      params: { key: "id" },
      result: {
        "1": { id: 1, data: "a" },
        "2": { id: 2, data: "b" },
      },
    },
  ],
  description: "Array To Object Agent",
  category: ["array"],
  cacheType: "pureAgent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_to_object.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default arrayToObjectAgentInfo;
