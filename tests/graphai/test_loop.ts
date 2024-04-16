import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";
import { sleeperAgent } from "@/experimental_agents";

import test from "node:test";
import assert from "node:assert";

const pushAgent: AgentFunction<{}, Record<string, any>, Record<string, any>> = async (context) => {
  const { inputs } = context;
  const [ array, item ] = inputs;
  // TODO: Varidation
  array.push(item);
  return array;
};

const graph_data = {
  loop: {
    count: 10
  },
  nodes: {
    array: {
      value: []
    },
    item: {
      agentId: "sleeper",
      params: {
        duration: 10,
        value: "hello"
      }
    },
    reducer: {
      agentId: "push",
      inputs: ["array", "item"]
    }
  }
};

test("test dispatch", async () => {
  const result = await graphDataTestRunner("test_loop", graph_data, { sleeper: sleeperAgent, push: pushAgent });
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
