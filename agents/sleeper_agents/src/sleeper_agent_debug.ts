import { AgentFunction, AgentFunctionInfo, strIntentionalError, sleep } from "graphai";
import deepmerge from "deepmerge";
import { isNamedInputs } from "@graphai/agent_utils";

export const sleeperAgentDebug: AgentFunction<{ duration: number; value?: Record<string, any>; fail?: boolean }> = async ({
  params,
  namedInputs,
  debugInfo: { retry },
}) => {
  await sleep(params.duration / (retry + 1));
  if (params.fail && retry < 2) {
    // console.log("failed (intentional)", nodeId, retry);
    throw new Error(strIntentionalError);
  }
  return (namedInputs.array ?? []).reduce((result: Record<string, any>, input: Record<string, any>) => {
    return deepmerge(result, input);
  }, params.value ?? {});
};

const sleeperAgentDebugInfo: AgentFunctionInfo = {
  name: "sleeperAgentDebug",
  agent: sleeperAgentDebug,
  mock: sleeperAgentDebug,
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
  description: "sleeper debug Agent",
  category: ["sleeper"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default sleeperAgentDebugInfo;
