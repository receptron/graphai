import { AgentFunction } from "@/graphai";
import { sleep } from "@/utils/utils";
import deepmerge from "deepmerge";

export const sleeperAgent: AgentFunction<{ duration: number; result?: Record<string, any> }> = async (context) => {
  const { params, inputs } = context;
  await sleep(params.duration);
  return inputs.reduce((result: Record<string, any>, input: Record<string, any>) => {
    return deepmerge(result, input);
  }, params.result ?? {});
};

export const sleeperAgentDebug: AgentFunction<{ duration: number; result?: Record<string, any>; fail?: boolean }> = async (context) => {
  const { nodeId, params, inputs, retry } = context;
  await sleep(params.duration / (retry + 1));
  if (params.fail && retry < 2) {
    console.log("failed (intentional)", nodeId, retry);
    throw new Error("Intentional Failure");
  }
  return inputs.reduce((result: Record<string, any>, input: Record<string, any>) => {
    return deepmerge(result, input);
  }, params.result ?? {});
};
