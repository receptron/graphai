import path from "path";
import { GraphAI, NodeExecute } from "../src/graphai";
import { readManifestData } from "./file_utils";
import { sleep } from "./utils";

import test from "node:test";
import assert from "node:assert";

const httpClientFunction: NodeExecute<Record<string, string>> = async (context) => {
  const { nodeId, retry, params } = context;
  console.log("executing", nodeId, params);

  const response = await fetch("http://127.0.0.1:8080/llm.json")
  const result = await response.json();

  console.log("completing", nodeId, result);
  return result;
};

const runTest = async () => {
  const graph_data = {
    nodes: {
      node1: {
        input: [],
        params: {}
      },
      node2: {
        params: {},
      }
    }
  };
  const graph = new GraphAI(graph_data, httpClientFunction);

  const results = await graph.run();
  return results;
};

test("test sample1", async () => {
  const result = await runTest();
  assert.deepStrictEqual(result, {
    node1: { result: true, messages: [ 'hello' ] },
    node2: { result: true, messages: [ 'hello' ] },
  });
});
