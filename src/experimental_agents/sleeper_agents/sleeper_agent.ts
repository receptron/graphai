import { AgentFunction } from "@/graphai";
import { sleep } from "@/utils/utils";
import deepmerge from "deepmerge";

export const sleeperAgent: AgentFunction<{ duration?: number; value?: Record<string, any> }> = async (context) => {
  const { params, inputs } = context;
  await sleep(params?.duration ?? 10);
  return inputs.reduce((result: Record<string, any>, input: Record<string, any>) => {
    return deepmerge(result, input);
  }, params.value ?? {});
};
