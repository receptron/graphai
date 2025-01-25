import { GraphAI, GraphData, sleep } from "@/index";
import { graphDataLatestVersion } from "~/common";
import * as agents from "~/test_agents";
import { GraphDataLoaderOption } from "@/type";

import test from "node:test";
import assert from "node:assert";

const graph_data: GraphData = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    sleep1: {
      agent: "sleeperAgent",
      params: {
        duration: 2000,
      },
      inputs: {
        text: ":message",
      },
      console: true,
    },
    sleep2: {
      agent: "sleeperAgent",
      params: {
        duration: 2000,
      },
      inputs: {
        text: ":sleep1.text",
      },
      console: true,
    },
  },
};

test("test graph", async () => {
  const graph = new GraphAI(graph_data, agents, {});

  await Promise.all([
    (async () => {
      const result = await graph.run(true);
      assert.deepStrictEqual(result, {
        message: "Hello World",
        sleep1: {
          text: "Hello World",
        },
      });
    })(),
    (async () => {
      await sleep(100);
      graph.abort();
    })(),
  ]);
});
