import { AgentFunction } from "@/index";

import { fileTestRunner } from "~/utils/runner";
import { sleep } from "@/utils/utils";
import { defaultTestAgents } from "@/utils/test_agents";
import { agentInfoWrapper } from "@/utils/utils";

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
  const result = await fileTestRunner("/graphs/test_dispatch.yml", { ...defaultTestAgents, dispatchAgent: agentInfoWrapper(dispatchAgent) });
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { port1: { node2: "dispatch" } },
    node3: { node3: "output", node1: "output", node2: "dispatch" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "dispatch" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "dispatch" },
  });
});
