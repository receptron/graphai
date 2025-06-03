import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const copy2ArrayAgent: AgentFunction<{ count: number }> = async ({ namedInputs, params }) => {
  assert(isNamedInputs(namedInputs), "copy2ArrayAgent: namedInputs is UNDEFINED!");
  const input = namedInputs.item ? namedInputs.item : namedInputs;
  return new Array(params.count).fill(undefined).map(() => {
    return input;
  });
};

// for test and document
const copy2ArrayAgentInfo: AgentFunctionInfo = {
  name: "copy2ArrayAgent",
  agent: copy2ArrayAgent,
  mock: copy2ArrayAgent,
  inputs: {
    type: "object",
    description: "The input item to be duplicated. Can be provided as 'item' or as a free-form object.",
    properties: {
      item: {
        description: "The item to be copied into each element of the resulting array.",
        anyOf: [{ type: "object" }, { type: "string" }, { type: "number" }, { type: "array" }, { type: "boolean" }],
      },
    },
    additionalProperties: true,
  },
  params: {
    type: "object",
    description: "Parameters controlling the number of copies to return.",
    properties: {
      count: {
        type: "integer",
        description: "The number of times to copy the input item into the output array.",
        minimum: 1,
      },
    },
    required: ["count"],
    additionalProperties: false,
  },
  output: {
    type: "array",
    description: "An array of 'count' copies of the input item.",
    items: {
      description: "A duplicated copy of the input item.",
      anyOf: [{ type: "object" }, { type: "string" }, { type: "number" }, { type: "array" }, { type: "boolean" }],
    },
  },
  samples: [
    {
      inputs: { item: { message: "hello" } },
      params: { count: 10 },
      result: [
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
      ],
    },
    {
      inputs: { message: "hello" },
      params: { count: 10 },
      result: [
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
      ],
    },
    {
      inputs: { item: "hello" },
      params: { count: 10 },
      result: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
    },
  ],
  description: "Copy2Array agent",
  category: ["test"],
  cacheType: "pureAgent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/copy2array_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};

export default copy2ArrayAgentInfo;
