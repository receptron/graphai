import path from "path";
import { GraphAI, NodeExecuteContext } from "../src/graphai";
import { readManifestData } from "./file_utils";
import { sleep } from "./utils";

import test from "node:test";
import assert from "node:assert";

const testFunction = async (context: NodeExecuteContext<Record<string, string>>) => {
  const { nodeId, retry, params, payload } = context;
  console.log("executing", nodeId);
  await sleep(params.delay / (retry + 1));

  if (params.fail && retry < 2) {
    const result = { [nodeId]: "failed" };
    console.log("failed (intentional)", nodeId, retry);
    throw new Error("Intentional Failure");
  } else {
    const result = Object.keys(payload).reduce(
      (result, key) => {
        result = { ...result, ...payload[key] };
        return result;
      },
      { [nodeId]: "output" },
    );
    console.log("completing", nodeId);
    return result;
  }
};

const runTest = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readManifestData(file_path);

  const graph = new GraphAI(graph_data, testFunction);

  const results = await graph.run();
  // console.log(results);
  return results;
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
    node3: undefined,
    node4: undefined,
    node5: undefined,
  });
});
