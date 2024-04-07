import path from "path";
import { GraphAI, NodeExecuteContext } from "../src/graphai";
import { readManifestData } from "../src/file_utils";
import { sleep } from "./utils";

import test from "node:test";
import assert from "node:assert";

const testFunction = async (context: NodeExecuteContext<Record<string, string>>) => {
  const { nodeId, retry, params, payload } = context;
  console.log("executing", nodeId, params);
  await sleep(params.delay / (retry + 1));

  if (params.fail && retry < 2) {
    const result = { [nodeId]: "failed" };
    console.log("failed", nodeId, result, retry);
    throw new Error("Intentional Failure");
  } else {
    const result = Object.keys(payload).reduce(
      (result, key) => {
        result = { ...result, ...payload[key] };
        return result;
      },
      { [nodeId]: "output" },
    );
    console.log("completing", nodeId, result);
    return result;
  }
};

const runTest = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readManifestData(file_path);

  const graph = new GraphAI(graph_data, testFunction);

  const results = await graph.run();
  console.log(results);
  return results;
};

test("test sample1", async () => {
  const result = await runTest("/graphs/sample1.yml");
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
    node3: { node3: "output", node1: "output", node2: "output" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "output" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "output" },
  });
});

test("test sample1", async () => {
  const result = await runTest("/graphs/sample2.yml");
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
    node3: { node3: "output", node1: "output", node2: "output" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "output" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "output" },
  });
  console.log("COMPLETE 2");
});
