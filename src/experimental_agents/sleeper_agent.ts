import { AgentFunction } from "@/graphai";
import { sleep } from "../utils/utils";

export const sleeperAgent: AgentFunction<{ duration: number; result?: Record<string, any>; index?: number }> = async (context) => {
  const { params, inputs } = context;
  await sleep(params.duration);
  return inputs.reduce((result: Record<string, any>, input: Record<string, any>) => {
    return { ...result, ...input };
  }, params.result ?? {});
};
