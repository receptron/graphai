import { AgentFunction, AgentFunctionInfo } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const mergeNodeIdAgent: AgentFunction<null, Record<string, unknown>, Record<string, unknown>, { array: Record<string, unknown>[] }> = async ({
  debugInfo: { nodeId },
  inputs,
  namedInputs,
}) => {
  // console.log("executing", nodeId);
  const dataSet = isNamedInputs(namedInputs) ? namedInputs.array : inputs;

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
      inputs: [{ message: "hello" }],
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
