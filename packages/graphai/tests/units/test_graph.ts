import { GraphAI, GraphData } from "@/index";
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
    namedResult: {
      agent: "nestedAgent",
      console: true,
      graphLoader: {
        fileName: "fileName",
        option: {
          meta: 123,
        },
      },
    },
  },
};

test("test graph", async () => {
  const graphLoader = (loaderOption: GraphDataLoaderOption) => {
    assert.equal(loaderOption.fileName, "fileName");
    const graph_data = {
      version: graphDataLatestVersion,
      nodes: {
        message: {
          value: "Hello World from loader",
        },
        template: {
          agent: "copyAgent",
          params: {
            namedKey: "text",
          },
          inputs: { text: ":message" },
          isResult: true,
        },
      },
    };

    return graph_data;
  };

  const graph = new GraphAI(graph_data, agents, { graphLoader });
  const result = await graph.run(true);
  assert.deepStrictEqual(result, {
    message: "Hello World",
    namedResult: {
      template: "Hello World from loader",
    },
  });
});
