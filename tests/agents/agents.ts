import { AgentFunction } from "@/graphai";
import { sleep } from "~/utils/utils";

export const testAgent: AgentFunction<{ delay: number; fail: boolean }> = async (context) => {
  const { nodeId, retry, params, inputs } = context;
  console.log("executing", nodeId);
  await sleep(params.delay / (retry + 1));

  if (params.fail && retry < 2) {
    const result = { [nodeId]: "failed" };
    console.log("failed (intentional)", nodeId, retry);
    throw new Error("Intentional Failure");
  } else {
    const result = inputs.reduce(
      (result: Record<string, any>, input: Record<string, any>) => {
        return { ...result, ...input };
      },
      { [nodeId]: "output" },
    );
    console.log("completing", nodeId);
    return result;
  }
};

export const bypassAgent: AgentFunction<{}> = async (context) => {
  if (context.inputs.length === 1) {
    return context.inputs[0];
  }
  return context.inputs;
};
export const echoAgent: AgentFunction<{}> = async (context) => {
  return context.params;
};
