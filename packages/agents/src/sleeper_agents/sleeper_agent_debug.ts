import { AgentFunction } from "graphai";
import { sleep, strIntentionalError } from "graphai/utils";
import deepmerge from "deepmerge";

export const sleeperAgentDebug: AgentFunction<{ duration: number; value?: Record<string, any>; fail?: boolean }> = async ({
  params,
  inputs,
  debugInfo: { retry },
}) => {
  await sleep(params.duration / (retry + 1));
  if (params.fail && retry < 2) {
    // console.log("failed (intentional)", nodeId, retry);
    throw new Error(strIntentionalError);
  }
  return inputs.reduce((result: Record<string, any>, input: Record<string, any>) => {
    return deepmerge(result, input);
  }, params.value ?? {});
};

const sleeperAgentDebugInfo = {
  name: "sleeperAgentDebug",
  agent: sleeperAgentDebug,
  mock: sleeperAgentDebug,
  samples: [],
  description: "sleeper debug Agent",
  category: ["sleeper"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default sleeperAgentDebugInfo;
