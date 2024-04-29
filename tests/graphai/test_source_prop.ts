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

const testAgent: AgentFunction<Record<never, never>, string> = async () => {
  return "test";
};

test("test loop & push", async () => {
  const result = await graphDataTestRunner(__filename, graphData, { testAgent }, () => {}, true);
  assert.deepStrictEqual(result, {
    input: "test",
    test: "test",
    test2: "test",
  });
});

/*
test("test source props test", async () => {
  await rejectTest(graphData, "resultsOf: result is not object. nodeId test", { testAgent });
});
*/
