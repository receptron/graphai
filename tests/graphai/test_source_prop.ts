import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";
// import { rejectTest } from "~/utils/runner";

import test from "node:test";
import assert from "node:assert";

const graphData = {
  nodes: {
    input: {
      agentId: "testAgent",
    },
    test: {
      agentId: "testAgent",
      inputs: ["input"],
    },
    test2: {
      agentId: "testAgent",
      inputs: ["test.hoge"],
    },
  },
};

const testAgent: AgentFunction<Record<never, never>, string | Record<string, any>> = async ({ inputs }) => {
  return inputs.length > 0 ? { inputs: inputs } : "test";
};

test("test loop & push", async () => {
  const result = await graphDataTestRunner(__filename, graphData, { testAgent }, () => {}, true);
  assert.deepStrictEqual(result, {
    input: "test",
    test: { inputs: ["test"] },
    test2: { inputs: [undefined] },
  });
});
