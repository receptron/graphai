import { GraphAI } from "@/index";

import * as agents from "~/test_agents";

import { graphDataLatestVersion } from "~/common";

import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    data: {
      value: 1,
    },
    debug: {
      agent: "copyAgent",
      inputs: {
        data: ":data",
      },
      console: { after: true },
    },
    sleep: {
      agent: "sleeperAgent",
      params: {
        namedKey: "text",
      },
      inputs: { text: ":debug" },
    },
  },
};

test("test add & loop", async () => {
  const graph = new GraphAI(graph_data, { ...agents });
  graph.setConcurrency(1)
  await graph.run();
  // assert.deepStrictEqual(res, { add: 6 });
});

test("test add & loop", async () => {
  const graph = new GraphAI(graph_data, { ...agents });

  await assert.rejects(
    async () => {
      graph.run();
      graph.setConcurrency(1)

    },
    { name: "Error", message: "Set concurrency error: This GraphAI instance is already running." },
  );
});

