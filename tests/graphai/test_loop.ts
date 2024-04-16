import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";

import { sleep } from "~/utils/utils";

import { sleeperAgent } from "@/experimental_agents";

import test from "node:test";
import assert from "node:assert";

const graph_data = {
  nodes: {
    node1: {
      agentId: "sleeper",
      params: {
        duration: 500,
        value: {
          node1: "output"
        }
      }
    }
  }
};

test("test dispatch", async () => {
  const result = await graphDataTestRunner("test_loop", graph_data, { sleeper: sleeperAgent });
  console.log(result);

  /*
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node20: { node2: "dispatch" },
    node3: { node3: "output", node1: "output", node2: "dispatch" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "dispatch" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "dispatch" },
  });
  */
});
