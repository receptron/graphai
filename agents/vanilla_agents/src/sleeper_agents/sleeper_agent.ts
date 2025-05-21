import { AgentFunction, AgentFunctionInfo, sleep } from "graphai";

export const sleeperAgent: AgentFunction<{ duration?: number }> = async ({ params, namedInputs }) => {
  await sleep(params?.duration ?? 10);
  return namedInputs;
};

const sleeperAgentInfo: AgentFunctionInfo = {
  name: "sleeperAgent",
  agent: sleeperAgent,
  mock: sleeperAgent,
  samples: [
    {
      inputs: {},
      params: { duration: 1 },
      result: {},
    },
    {
      inputs: { array: [{ a: 1 }, { b: 2 }] },
      params: { duration: 1 },
      result: {
        array: [{ a: 1 }, { b: 2 }],
      },
    },
  ],
  description: "sleeper Agent",
  category: ["sleeper"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/sleeper_agents/sleeper_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default sleeperAgentInfo;
