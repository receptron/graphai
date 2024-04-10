import { GraphAI, AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";

import test from "node:test";
import assert from "node:assert";

const httpClientAgent: AgentFunction<Record<string, string>> = async (context) => {
  const { nodeId, retry, params, outputs } = context;
  console.log("executing", nodeId, params, outputs);

  const response = await fetch(params.url);
  const result = await response.json();

  console.log("completing", nodeId, result);
  return result;
};

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

test("test sample1", async () => {
  const result = await graphDataTestRunner("http.log", graph_data, httpClientAgent);
  assert.deepStrictEqual(result, {
    node1: { result: true, messages: ["hello"] },
    node2: { result: true, messages: ["hello2"] },
  });
});
