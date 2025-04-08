import { AgentFunction, AgentFunctionInfo } from "graphai";

export const copyMessageAgent: AgentFunction<{ count: number; message: string }, { messages: string[] }> = async ({ params }) => {
  return {
    messages: new Array(params.count).fill(undefined).map(() => {
      return params.message;
    }),
  };
};

// for test and document
const copyMessageAgentInfo: AgentFunctionInfo = {
  name: "copyMessageAgent",
  agent: copyMessageAgent,
  mock: copyMessageAgent,
  samples: [
    {
      inputs: {},
      params: { count: 4, message: "hello" },
      result: { messages: ["hello", "hello", "hello", "hello"] },
    },
  ],
  description: "CopyMessage agent",
  category: ["test"],
  cacheType: "pureAgent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/copy_message_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};

export default copyMessageAgentInfo;
