import { NodeExecute } from "@/graphai";
import { sleep } from "~/utils";

export const testAgent: NodeExecute<{ delay: number; fail: boolean }> = async (context) => {
  const { nodeId, retry, params, payload } = context;
  console.log("executing", nodeId);
  await sleep(params.delay / (retry + 1));

  if (params.fail && retry < 2) {
    const result = { [nodeId]: "failed" };
    console.log("failed (intentional)", nodeId, retry);
    throw new Error("Intentional Failure");
  } else {
    const result = Object.keys(payload).reduce(
      (result, key) => {
        result = { ...result, ...payload[key] };
        return result;
      },
      { [nodeId]: "output" },
    );
    console.log("completing", nodeId);
    return result;
  }
};
