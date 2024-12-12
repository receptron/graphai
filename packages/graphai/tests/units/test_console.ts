import { GraphAI, GraphData } from "@/index";

import * as agents from "~/test_agents";

import { graphDataLatestVersion } from "~/common";

import test from "node:test";

const get_graph_data = () => {
  return {
    version: graphDataLatestVersion,
    nodes: {
      data: {
        value: 1,
      },
      copy: {
        inputs: { data: ":data" },
        console: { after: { template: ":data" } },
        agent: "copyAgent",
        isResult: true,
      },
      copy2: {
        inputs: { data2: ":data" },
        console: true,
        agent: "copyAgent",
        isResult: true,
      },
      copy3: {
        inputs: { data3: ":data" },
        console: {
          after: true,
        },
        agent: "copyAgent",
        isResult: true,
      },
    },
  };
};

test("test add & loop", async () => {
  const graph = new GraphAI(get_graph_data(), { ...agents });
  await graph.run();
});
