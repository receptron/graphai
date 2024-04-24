import { AgentFunction } from "@/graphai";
import { sleep } from "@/utils/utils";
import deepmerge from "deepmerge";

export const sleeperAgentDebug: AgentFunction<{ duration: number; value?: Record<string, any>; fail?: boolean }> = async ({
  params,
  inputs,
  debugInfo: { retry },
}) => {
  await sleep(params.duration / (retry + 1));
  if (params.fail && retry < 2) {
    // console.log("failed (intentional)", nodeId, retry);
    throw new Error("Intentional Failure");
  }
  return inputs.reduce((result: Record<string, any>, input: Record<string, any>) => {
    return deepmerge(result, input);
  }, params.value ?? {});
};
