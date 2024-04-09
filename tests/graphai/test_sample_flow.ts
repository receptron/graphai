import path from "path";
import { GraphAI } from "@/graphai";
import { readGraphaiData } from "~/file_utils";

import { testAgent } from "./agents";

import test from "node:test";
import assert from "node:assert";

const runTest = async (file: string, callback:(graph:GraphAI) => void = ()=>{}) => {
  const file_path = path.resolve(__dirname) + "/.." + file;
  const graph_data = readGraphaiData(file_path);
  const graph = new GraphAI(graph_data, testAgent);
  callback(graph);

  try {
    const results = await graph.run();
    // console.log(graph.transactionLogs());
    return results;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error:", error.message);
    }
    // console.log(graph.transactionLogs());
    return graph.results();
  }
};

test("test base", async () => {
  const result = await runTest("/graphs/test_base.yml");
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
    node3: { node3: "output", node1: "output", node2: "output" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "output" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "output" },
  });
});

test("test retry", async () => {
  const result = await runTest("/graphs/test_retry.yml");
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
    node3: { node3: "output", node1: "output", node2: "output" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "output" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "output" },
  });
});

test("test error", async () => {
  const result = await runTest("/graphs/test_error.yml");
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
  });
});

test("test timeout", async () => {
  const result = await runTest("/graphs/test_timeout.yml");
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
    node3: { node3: "output", node1: "output", node2: "output" },
  });
});

test("test source", async () => {
  const result = await runTest("/graphs/test_source.yml", (graph:GraphAI) => {
    graph.injectResult("node2", { "node2": "injected" })    
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
  const result = await runTest("/graphs/test_source2.yml", (graph:GraphAI) => {
    graph.injectResult("node1", { "node1": "injected" })    
    graph.injectResult("node2", { "node2": "injected" })    
  });
  assert.deepStrictEqual(result, {
    node1: { node1: "injected" },
    node2: { node2: "injected" },
    node3: { node3: "output", node1: "injected", node2: "injected" },
    node4: { node4: "output", node3: "output", node1: "injected", node2: "injected" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "injected", node2: "injected" },
  });
});
