import { AgentFunction } from "@/graphai";
import { fileTestRunner } from "~/utils/runner";
import { agentInfoWrapper } from "@/utils/utils";

import test from "node:test";
import assert from "node:assert";

const testAgent1: AgentFunction = async ({ debugInfo: { nodeId } }) => {
  const result = { [nodeId]: "output 1" };
  return result;
};

const testAgent2: AgentFunction = async ({ debugInfo: { nodeId } }) => {
  const result = { [nodeId]: "output 2" };
  return result;
};

const numberTestAgent: AgentFunction<{ number: number }, { [key: string]: number }> = async ({ debugInfo: { nodeId }, params }) => {
  const result = { [nodeId]: params.number };
  return result;
};

test("test multiple function", async () => {
  const result = await fileTestRunner("/graphs/test_multiple_functions_1.yml", {
    test1: agentInfoWrapper(testAgent1),
    test2: agentInfoWrapper(testAgent2),
    numberTestAgent: agentInfoWrapper(numberTestAgent),
  });
  assert.deepStrictEqual(result, {
    node1: { node1: "output 1" },
    node2: { node2: "output 1" },
    node3: { node3: "output 2" },
    node4: { node4: "output 1" },
    node5: { node5: "output 2" },
    node6: { node6: 10 },
  });
});
