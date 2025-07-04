import { GraphAI } from "../../src/index";
import { StaticNode } from "../../src/node";
import { NodeState } from "../../src/type";

import { graph_data } from "../units/graph_data";

import test from "node:test";
import assert from "node:assert";

test("test static node injection", async () => {
  const graph = new GraphAI(graph_data, {}, { bypassAgentIds: ["echoAgent", "copyAgent"] });
  const nodeId = "nodeId";
  const node = new StaticNode(nodeId, { value: { data: "123" } }, graph);
  assert.deepStrictEqual(node.value, { data: "123" });
  assert.equal(undefined, node.result);
  assert.equal(node.state, NodeState.Waiting);

  node.updateValue({ updated: "abc" });
  node.setResultValue();
  assert.deepStrictEqual(node.result, { updated: "abc" });
  assert.equal(node.state, NodeState.Injected);
});
