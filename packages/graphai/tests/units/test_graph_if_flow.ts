import { GraphAI, GraphData } from "../../src/index";
import { graphDataLatestVersion } from "../common";
import * as agents from "../test_agents";
import { GraphDataLoaderOption } from "../../src/type";

import test from "node:test";
import assert from "node:assert";

const graph_data: GraphData = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: {
        // valueA: "Hello World",
        valueB: "Hello World",
      },
    },
    flowA: {
      if: ":message.valueA",
      agent: "copyAgent",
      inputs: {
        data: ":message.valueA",
      },
    },
    flowA2: {
      if: ":flowA.data",
      agent: "copyAgent",
      inputs: {
        data: ":flowA.data",
      },
    },
    flowA3: {
      if: ":flowA2.data",
      agent: "copyAgent",
      inputs: {
        data: ":flowA2.data",
      },
      defaultValue: {},
    },
    flowB: {
      if: ":message.valueB",
      agent: "copyAgent",
      inputs: {
        data: ":message.valueB",
      },
    },
    merge: {
      // anyInput: true,
      agent: "copyAgent",
      inputs: {
        data: [":flowA3.data", ":flowB.data"],
      },
    },
  },
};

test("test graph", async () => {
  const graph = new GraphAI(graph_data, agents);
  const result = await graph.run(true);
  console.log(result);
  // assert.deepStrictEqual(result, {});
});
