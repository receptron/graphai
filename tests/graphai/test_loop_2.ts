import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";

import test from "node:test";
import assert from "node:assert";

const graphdata_push = {
  loop: {
    count: 10,
  },
  nodes: {
    data: {
      value: { v: 0 },
      update: "counter",
    },
    counter: {
      agentId: "counterAgent",
      inputs: ["data"],
    },
  },
};

test("test counter", async () => {
  const result = await graphDataTestRunner("test_loop_pop", graphdata_push, {
    counterAgent: async ({ inputs }) => {
      return { v: inputs[0].v + 1 };
    },
  });
  assert.deepStrictEqual(result, { data: { v: 9 }, counter: { v: 10 } });
});
