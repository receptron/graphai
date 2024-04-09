import path from "path";
import { GraphAI, AgentFunction } from "@/graphai";
import { readGraphaiData } from "~/file_utils";

import test from "node:test";
import assert from "node:assert";

const testAgent1: AgentFunction = async (context) => {
  const { nodeId, retry, params } = context;
  console.log("executing", nodeId, params);

  const result = { [nodeId]: "output 1" };
  console.log("completing", nodeId, result);
  return result;
};

const testAgent2: AgentFunction = async (context) => {
  const { nodeId, retry, params } = context;
  console.log("executing", nodeId, params);

  const result = { [nodeId]: "output 2" };
  console.log("completing", nodeId, result);
  return result;
};

const numberTestAgent: AgentFunction<{ number: number }, { [key: string]: number }> = async (context) => {
  const { nodeId, retry, params } = context;
  console.log("executing", nodeId, params);

  const result = { [nodeId]: params.number };
  console.log("completing", nodeId, result);
  return result;
};

const runTest = async (file: string) => {
  const file_path = path.resolve(__dirname) + "/.." + file;
  const graph_data = readGraphaiData(file_path);

  const graph = new GraphAI(graph_data, { default: testAgent1, test2: testAgent2, numberTestAgent });

  const results = await graph.run();
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
    node6: { node6: 10 },
  });
});
