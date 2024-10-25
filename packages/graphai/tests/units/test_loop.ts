import { GraphAI } from "@/index";

import * as agents from "~/test_agents";

import { graphDataLatestVersion } from "~/common";

import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: graphDataLatestVersion,
  loop: {
    count: 5,
  },
  nodes: {
    data: {
      value: 1,
      update: ":add",
      console: { after: true },
    },
    add: {
      inputs: { counter: ":data" },
      agent: async (namedInputs: any) => {
        return namedInputs.counter + 1;
      },
      isResult: true,
    },
  },
};

test("test loop", async () => {
  const graph = new GraphAI(graph_data, { ...agents });
  const res = await graph.run();

  // console.log(JSON.stringify(res, null, 2));
  assert.deepStrictEqual(res, { add: 6 });
});
