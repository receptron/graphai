import { GraphAI } from "@/index";

import * as agents from "~/test_agents";

import { graphDataLatestVersion } from "~/common";

import test from "node:test";
import assert from "node:assert";

const get_graph_data = (inputs: string) => {
  return {
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
        inputs: { counter: inputs },
        agent: async (namedInputs: any) => {
          return namedInputs.counter;
        },
        isResult: true,
      },
    },
  };
};

test("test add & loop", async () => {
  const graph = new GraphAI(get_graph_data(":data.add(1)"), { ...agents });
  const res = await graph.run();

  // console.log(JSON.stringify(res, null, 2));
  assert.deepStrictEqual(res, { add: 6 });
});

test("test add & loop 2", async () => {
  const graph = new GraphAI(get_graph_data(":data.add(-1)"), { ...agents });
  const res = await graph.run();

  assert.deepStrictEqual(res, { add: -4 });
});

test("test add & loop 2 only int failed", async () => {
  const graph = new GraphAI(get_graph_data(":data.add(1.0)"), { ...agents });
  const res = await graph.run();

  assert.deepStrictEqual(res, {});
});
