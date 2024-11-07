import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";
import * as agents from "~/test_agents";
import { GraphDataReaderOption } from "@/type";

import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    namedResult: {
      agent: "nestedAgent",
      graph: {
        fileName: "fileName",
        option: {
          meta: 123,
        },
      },
    },
  },
};

test("test graph", async () => {
  const graphReader = (readerOption: GraphDataReaderOption) => {
    assert.equal(readerOption.fileName, "fileName");
    const graph_data = {
      version: graphDataLatestVersion,
      nodes: {
        message: {
          value: "Hello World from reader",
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

  const graph = new GraphAI(graph_data, agents, { graphReader });
  const result = await graph.run(true);
  assert.deepStrictEqual(result, {
    message: "Hello World",
    namedResult: {
      template: "Hello World from reader",
    },
  });
});
