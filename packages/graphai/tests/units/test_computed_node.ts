import { GraphAI, NodeState } from "@/index";
import { ComputedNode } from "@/node";

import { graph_data } from "~/units/graph_data";

import test from "node:test";
import assert from "node:assert";

test("test computed node", async () => {
  const graph = new GraphAI(graph_data, {}, { bypassAgentIds: ["echoAgent", "copyAgent"] });
  const nodeId = "echo";
  const nodeData = {
    agent: "echoAgent",
    params: {
      message: "hello",
    },
    inputs: {
      data: ":copyAgent",
    },
  };

  const node = new ComputedNode("123", nodeId, nodeData, graph);
  assert.equal(false, node.isReadyNode());
  assert.equal("echoAgent", node.getAgentId());
  assert.deepStrictEqual(["copyAgent"], Array.from(node.pendings));
  assert.equal(NodeState.Waiting, node.state);
  assert.equal("echo", node.nodeId);
  // node.beforeAddTask()
  // node.removePending();
  // node.execute()
});
