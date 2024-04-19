import { AgentFunction } from "@/graphai";
import { fileTestRunner } from "~/utils/runner";

import test from "node:test";
import assert from "node:assert";

const testAgent1: AgentFunction = async (context) => {
  const { nodeId } = context;
  // console.log("executing", nodeId, params);

  const result = { [nodeId]: "output 1" };
  // console.log("completing", nodeId, result);
  return result;
};

const testAgent2: AgentFunction = async (context) => {
  const { nodeId } = context;
  // console.log("executing", nodeId, params);

  const result = { [nodeId]: "output 2" };
  // console.log("completing", nodeId, result);
  return result;
};

const numberTestAgent: AgentFunction<{ number: number }, { [key: string]: number }> = async (context) => {
  const { nodeId, params } = context;
  // console.log("executing", nodeId, params);

  const result = { [nodeId]: params.number };
  // console.log("completing", nodeId, result);
  return result;
};

test("test multiple function", async () => {
  const result = await fileTestRunner("/graphs/test_multiple_functions_1.yml", { test1: testAgent1, test2: testAgent2, numberTestAgent });
  assert.deepStrictEqual(result, {
    node1: { node1: "output 1" },
    node2: { node2: "output 1" },
    node3: { node3: "output 2" },
    node4: { node4: "output 1" },
    node5: { node5: "output 2" },
    node6: { node6: 10 },
  });
});
