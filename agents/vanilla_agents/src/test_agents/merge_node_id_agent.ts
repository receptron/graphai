import { AgentFunction, AgentFunctionInfo } from "graphai";
import { arrayValidate } from "@graphai/agent_utils";
import type { GraphAIArray } from "@graphai/agent_utils";

export const mergeNodeIdAgent: AgentFunction<null, Record<string, unknown>, GraphAIArray<Record<string, unknown>>> = async ({
  debugInfo: { nodeId },
  namedInputs,
}) => {
  arrayValidate("mergeNodeIdAgent", namedInputs);

  const dataSet = namedInputs.array;

  return dataSet.reduce(
    (tmp, input) => {
      return { ...tmp, ...input };
    },
    { [nodeId]: "hello" },
  );
};

// for test and document
const mergeNodeIdAgentInfo: AgentFunctionInfo = {
  name: "mergeNodeIdAgent",
  agent: mergeNodeIdAgent,
  mock: mergeNodeIdAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "An array of objects to be merged together into a single object. Each object represents a partial result or state.",
        items: {
          type: "object",
          description: "A single object containing key-value pairs to merge.",
        },
      },
    },
    required: ["array"],
    additionalProperties: false,
  },
  params: {
    type: "object",
    description: "This agent does not take any parameters. The object must be empty.",
    properties: {},
    additionalProperties: false,
  },
  samples: [
    {
      inputs: { array: [{ message: "hello" }] },
      params: {},
      result: {
        message: "hello",
        test: "hello",
      },
    },
  ],
  description: "merge node id agent",
  category: ["test"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/merge_node_id_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};

export default mergeNodeIdAgentInfo;
