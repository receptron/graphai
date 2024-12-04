import { AgentFunction, AgentFunctionInfo, sleep } from "graphai";
import deepmerge from "deepmerge";
import { isNamedInputs } from "@graphai/agent_utils";

export const sleepAndMergeAgent: AgentFunction<{ duration?: number; value?: Record<string, any> }> = async ({ params, namedInputs }) => {
  await sleep(params?.duration ?? 10);
  return namedInputs.array.reduce((result: Record<string, any>, input: Record<string, any>) => {
    return deepmerge(result, input);
  }, params.value ?? {});
};

const sleeperAndMergeInfo: AgentFunctionInfo = {
  name: "sleepAndMergeAgent",
  agent: sleepAndMergeAgent,
  mock: sleepAndMergeAgent,
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
  description: "sleeper and merge Agent",
  category: ["sleeper"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default sleeperAndMergeInfo;
