import { AgentFunction, AgentFunctionInfo } from "graphai";

export const mergeNodeIdAgent: AgentFunction = async ({
  debugInfo: { nodeId },
  inputs,
}) => {
  // console.log("executing", nodeId);
  return inputs.reduce(
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
