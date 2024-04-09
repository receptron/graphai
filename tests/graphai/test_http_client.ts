import { GraphAI, AgentFunction } from "@/graphai";

import test from "node:test";
import assert from "node:assert";

const httpClientAgent: AgentFunction<Record<string, string>> = async (context) => {
  const { nodeId, retry, params, payload } = context;
  console.log("executing", nodeId, params, payload);

  const response = await fetch(params.url);
  const result = await response.json();

  console.log("completing", nodeId, result);
  return result;
};

const runTest = async () => {
  const graph_data = {
    nodes: {
      node1: {
        params: {
          url: "http://127.0.0.1:8080/llm.json",
        },
      },
      node2: {
        params: {
          url: "http://127.0.0.1:8080/llm2.json",
        },
        inputs: ["node1"],
      },
    },
  };
  const graph = new GraphAI(graph_data, httpClientAgent);

  const results = await graph.run();
  return results;
};

test("test sample1", async () => {
  const result = await runTest();
  assert.deepStrictEqual(result, {
    node1: { result: true, messages: ["hello"] },
    node2: { result: true, messages: ["hello2"] },
  });
});
