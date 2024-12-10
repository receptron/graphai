import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";
import * as agents from "~/test_agents";

import test from "node:test";
import assert from "node:assert";

test("test if default value 1", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      message: {
        value: {
          text: "Hello World",
        },
      },
      result: {
        agent: "copyAgent",
        inputs: {
          text: ":message.text",
        },
        isResult: true,
        output: {
          message: ".text",
        },
      },
    },
  };

  const graph = new GraphAI(graph_data, agents);
  const result = await graph.run();
  assert.deepStrictEqual(result, {
    result: {
      message: "Hello World",
    },
  });
});
