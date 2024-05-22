import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";

import test from "node:test";
import assert from "node:assert";

const graph_data_fetch = {
  version: 0.3,
  nodes: {
    source1: {
      value: { apple: "red" },
      isResult: true,
    },
  },
};

test("test fetch", async () => {
  const result = await graphDataTestRunner(__filename, graph_data_fetch, { ...defaultTestAgents }, () => {}, false);
  assert.deepStrictEqual(result, {
    test1: { fruit: { apple: "red" }, color: "yellow" },
    test2: { fruit: { apple: "red" }, color: "yellow" },
  });
});