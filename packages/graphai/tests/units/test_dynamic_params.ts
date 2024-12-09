import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";
import * as agents from "~/test_agents";

import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    one: {
      value: "1",
    },
    two: {
      value: {
        value: "2 value",
      },
    },
    result: {
      agent: "echoAgent",
      params: {
        test: {
          test: ":message",
        },
        array: [":one", { a: ":two.value" }],
      },
      isResult: true,
    },
  },
};

test("test graph", async () => {
  const graph = new GraphAI(graph_data, agents);
  const result = await graph.run();
  assert.deepStrictEqual(result, {
    result: {
      test: {
        test: "Hello World",
      },
      array: ["1", { a: "2 value" }],
    },
  });
});
