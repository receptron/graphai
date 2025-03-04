import { AgentFunction, AgentFunctionInfo } from "graphai";
import { arrayValidate } from "@graphai/agent_utils"
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
  license: "MIT",
};

export default mergeNodeIdAgentInfo;
