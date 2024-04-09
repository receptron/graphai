import path from "path";
import { GraphAI, AgentFunction } from "@/graphai";
import { readGraphaiData } from "~/file_utils";
import { sleep } from "~/utils";
import * as fs from 'fs';

import { testAgent } from "./agents";

import test from "node:test";
import assert from "node:assert";

const dispatchAgent: AgentFunction<{ delay: number; fail: boolean }> = async (context) => {
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
      { [nodeId]: "dispatch" },
    );
    console.log("completing", nodeId);
    return { output1: result };
  }
};

const runTest = async (file: string, callback: (graph: GraphAI) => void = () => {}) => {
  const file_path = path.resolve(__dirname) + "/.." + file;
  const log_path = path.resolve(__dirname) + "/../logs/" + path.basename(file_path).replace(/\.yml$/, ".log");
  const graph_data = readGraphaiData(file_path);
  const graph = new GraphAI(graph_data, { default: testAgent, alt: dispatchAgent });
  callback(graph);

  try {
    const results = await graph.run();
    fs.writeFileSync(log_path, JSON.stringify(graph.transactionLogs(), null, 2));
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

test("test dispatch", async () => {
  const result = await runTest("/graphs/test_dispatch.yml");
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node20: { node2: "dispatch" },
    node3: { node3: "output", node1: "output", node2: "dispatch" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "dispatch" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "dispatch" },
  });
});
