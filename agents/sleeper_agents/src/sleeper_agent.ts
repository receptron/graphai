import { AgentFunction, AgentFunctionInfo, sleep } from "graphai";
import deepmerge from "deepmerge";
import { isNamedInputs } from "@graphai/agent_utils";

export const sleeperAgent: AgentFunction<{ duration?: number; value?: Record<string, any> }> = async ({ params, inputs, namedInputs }) => {
  await sleep(params?.duration ?? 10);
  return (isNamedInputs(namedInputs) ? namedInputs.array : inputs).reduce((result: Record<string, any>, input: Record<string, any>) => {
    return deepmerge(result, input);
  }, params.value ?? {});
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
      inputs: [{ a: 1 }, { b: 2 }],
      params: { duration: 1 },
      result: {
        a: 1,
        b: 2,
      },
    },
    {
      inputs: { array: [{ a: 1 }, { b: 2 }] },
      params: { duration: 1 },
      result: {
        a: 1,
        b: 2,
      },
    },
  ],
  description: "sleeper Agent",
  category: ["sleeper"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default sleeperAgentInfo;
