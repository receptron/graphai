import path from "path";
import { GraphAI, NodeExecuteContext } from "../src/graphai";
import { readManifestData } from "../src/file_utils";
import { sleep } from "./utils";

import test from "node:test";
import assert from "node:assert";

const testFunction1 = async (context: NodeExecuteContext<Record<string, string>>) => {
  const { nodeId, retry, params } = context;
  console.log("executing", nodeId, params);

  const result = { [nodeId]: "output 1" };
  console.log("completing", nodeId, result);
  return result;
};

const testFunction2 = async (context: NodeExecuteContext<Record<string, string>>) => {
  const { nodeId, retry, params } = context;
  console.log("executing", nodeId, params);

  const result = { [nodeId]: "output 2" };
  console.log("completing", nodeId, result);
  return result;
};

const runTest = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readManifestData(file_path);

  const graph = new GraphAI(graph_data, { default: testFunction1, test2: testFunction2 });

  const results = await graph.run();
  console.log(results);
  return results;
};

test("test sample1", async () => {
  const result = await runTest("/graphs/test_multiple_functions_1.yml");
  assert.deepStrictEqual(result, {
    node1: { node1: "output 1" },
    node2: { node2: "output 1" },
    node3: { node3: "output 2" },
    node4: { node4: "output 1" },
    node5: { node5: "output 2" },
  });
});
