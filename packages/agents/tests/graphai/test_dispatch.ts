import { AgentFunction } from "graphai";

import * as agents from "@/index";
import { fileTestRunner } from "@graphai/test_utils";
import { sleep } from "graphai/lib/utils/utils";
import { agentInfoWrapper } from "graphai/lib//utils/utils";

import test from "node:test";
import assert from "node:assert";

const dispatchAgent: AgentFunction<{ delay: number; fail: boolean }, Record<string, any>, Record<string, any>> = async ({
  debugInfo: { nodeId, retry },
  params,
  inputs,
}) => {
  await sleep(params.delay / (retry + 1));

  if (params.fail && retry < 2) {
    // const result = { [nodeId]: "failed" };
    console.log("failed (intentional)", nodeId, retry);
    throw new Error("Intentional Failure");
  } else {
    const result = inputs.reduce(
      (result: Record<string, any>, input: Record<string, any>) => {
        return { ...result, ...input };
      },
      { [nodeId]: "dispatch" },
    );
    return { port1: result };
  }
};

test("test dispatch", async () => {
  const result = await fileTestRunner(__dirname, "/graphs/test_dispatch.yml", { ...agents, dispatchAgent: agentInfoWrapper(dispatchAgent) });
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { port1: { node2: "dispatch" } },
    node3: { node3: "output", node1: "output", node2: "dispatch" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "dispatch" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "dispatch" },
  });
});
