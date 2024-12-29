import { GraphAI } from "@/index";

import * as agents from "~/test_agents";

import { graphDataLatestVersion } from "~/common";

import test from "node:test";
import assert from "node:assert";

const get_graph_data = () => {
  return {
    version: graphDataLatestVersion,
    nodes: {
      data: {
        value: 1,
      },
      copy: {
        inputs: { data: ":data" },
        agent: "copyConfigAgent",
        isResult: true,
      },
    },
  };
};

test("test add & loop", async () => {
  const graph = new GraphAI(get_graph_data(), { ...agents }, { config: { copyConfigAgent: { test: "message" } } });
  const result = await graph.run();
  // { copy: { copyConfig: { test: 'aaa' } } }
  assert.deepStrictEqual(result, {
    copy: { test: "message" },
  });
});
