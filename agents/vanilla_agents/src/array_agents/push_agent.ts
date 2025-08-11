import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { arrayValidate } from "@graphai/agent_utils";
import type { GraphAIArray, GraphAIArrayWithOptionalItemAndItems } from "@graphai/agent_utils";

export const pushAgent: AgentFunction<{ arrayKey?: string }, GraphAIArray | Record<string, unknown[]>, GraphAIArrayWithOptionalItemAndItems> = async ({
  namedInputs,
  params,
}) => {
  const extra_message = " Set inputs: { array: :arrayNodeId, item: :itemNodeId }";
  arrayValidate("pushAgent", namedInputs, extra_message);
  const { item, items, array, ...rest } = namedInputs;
  assert(item !== undefined || items !== undefined, "pushAgent: namedInputs.item and namedInputs.items are UNDEFINED!" + extra_message);
  assert(items === undefined || Array.isArray(items), "pushAgent: namedInputs.items is not array!");

  const arrayCopy = array.map((item: any) => item); // shallow copy
  if (item !== undefined) {
    arrayCopy.push(item);
  }
  if (items) {
    items.forEach((item) => {
      arrayCopy.push(item);
    });
  }
  if (params.arrayKey) {
    return {
      ...rest,
      [params.arrayKey]: arrayCopy,
    };
  }
  return {
    ...rest,
    array: arrayCopy,
  };
};

const pushAgentInfo: AgentFunctionInfo = {
  name: "pushAgent",
  agent: pushAgent,
  mock: pushAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "the array to push an item to",
      },
      item: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }, { type: "boolean" }],
        description: "the item push into the array",
      },
      items: {
        type: "array",
        description: "items push into the array",
      },
    },
    required: ["array"],
  },
  output: {
    type: "object",
    properties: {
      array: {
        type: "array",
      },
    },
  },
  samples: [
    {
      inputs: { array: [1, 2], item: 3 },
      params: {},
      result: { array: [1, 2, 3] },
    },
    {
      inputs: { array: [true, false], item: false },
      params: {},
      result: { array: [true, false, false] },
    },
    {
      inputs: { array: [1, 2], item: 3, data: { example: "hello"} },
      params: {},
      result: { array: [1, 2, 3], data: { example: "hello"} },
    },
    {
      inputs: { array: [{ apple: 1 }], item: { lemon: 2 } },
      params: {},
      result: { array: [{ apple: 1 }, { lemon: 2 }] },
    },
    {
      inputs: { array: [{ apple: 1 }], items: [{ lemon: 2 }, { banana: 3 }] },
      params: {},
      result: { array: [{ apple: 1 }, { lemon: 2 }, { banana: 3 }] },
    },
    {
      inputs: { array: [1, 2], item: 3 },
      params: { arrayKey: "test" },
      result: { test: [1, 2, 3] },
    },
  ],
  description: "push Agent",
  category: ["array"],
  cacheType: "pureAgent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/push_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default pushAgentInfo;
