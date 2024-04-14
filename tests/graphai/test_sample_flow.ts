import { GraphAI } from "@/graphai";
import { sleeperAgent, sleeperAgentDebug, nestedAgent } from "@/experimental_agents";
import { fileTestRunner } from "~/utils/runner";

import test from "node:test";
import assert from "node:assert";

test("test base", async () => {
  const result = await fileTestRunner("/graphs/test_base.yml", sleeperAgent);
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
    node3: { node3: "output", node1: "output", node2: "output" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "output" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "output" },
  });
});

test("test retry", async () => {
  const result = await fileTestRunner("/graphs/test_retry.yml", sleeperAgentDebug);
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
    node3: { node3: "output", node1: "output", node2: "output" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "output" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "output" },
  });
});

test("test error", async () => {
  const result = await fileTestRunner("/graphs/test_error.yml", sleeperAgentDebug);
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
  });
});

test("test timeout", async () => {
  const result = await fileTestRunner("/graphs/test_timeout.yml", sleeperAgentDebug);
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
    node3: { node3: "output", node1: "output", node2: "output" },
  });
});

test("test source", async () => {
  const result = await fileTestRunner("/graphs/test_source.yml", sleeperAgent, (graph: GraphAI) => {
    graph.injectResult("node2", { node2: "injected" });
  });
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "injected" },
    node3: { node3: "output", node1: "output", node2: "injected" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "injected" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "injected" },
  });
});

test("test source2", async () => {
  const result = await fileTestRunner("/graphs/test_source2.yml", sleeperAgent, (graph: GraphAI) => {
    graph.injectResult("node1", { node1: "injected" });
  });
  assert.deepStrictEqual(result, {
    node1: { node1: "injected" },
    node2: { node2: "preset" },
    node3: { node3: "output", node1: "injected", node2: "preset" },
    node4: { node4: "output", node3: "output", node1: "injected", node2: "preset" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "injected", node2: "preset" },
  });
});

test("test nested", async () => {
  const result = await fileTestRunner("/graphs/test_nested.yml", { sleeper: sleeperAgent, nested: nestedAgent });
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node10: "output", node20: "output", node30: "output" },
    node3: { node3: "output", node1: "output", node10: "output", node20: "output", node30: "output" },
    node4: { node4: "output", node3: "output", node1: "output", node10: "output", node20: "output", node30: "output" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node10: "output", node20: "output", node30: "output" },
  });
});
