import { AgentFunction } from "@/graphai";
import { sleep } from "~/utils/utils";

export const testAgent: AgentFunction<{ delay: number; fail: boolean }> = async (context) => {
  const { nodeId, retry, params, outputs } = context;
  console.log("executing", nodeId);
  await sleep(params.delay / (retry + 1));

  if (params.fail && retry < 2) {
    const result = { [nodeId]: "failed" };
    console.log("failed (intentional)", nodeId, retry);
    throw new Error("Intentional Failure");
  } else {
    const result = outputs.reduce((result: Record<string, any>, output: Record<string, any>) => {
      return { ...result, ...output };
    }, { [nodeId]: "dispatch" });
    console.log("completing", nodeId);
    return result;
  }
};
