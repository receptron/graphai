import { GraphAI } from "../../src/index";

import * as agents from "../test_agents";

import { graphDataLatestVersion } from "../common";

import test from "node:test";
import assert from "node:assert";

let i = 0;
const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    echo: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
    },
    retryNode: {
      retry: 3,
      repeatUntil: {
        exists: ".text",
      },
      agent: async (namedInputs: { text: string }) => {
        i = i + 1;
        if (i === 3) {
          return { text: namedInputs.text, counter: i };
        }
        return {};
      },
      inputs: { text: ":echo.message" },
    },
    copyAgent: {
      agent: "copyAgent",
      inputs: { text: ":retryNode.text", counter: ":retryNode.counter" },
      isResult: true,
    },
  },
};

test("test retry", async () => {
  const graph = new GraphAI(graph_data, { ...agents });
  const res = await graph.run();

  assert.deepStrictEqual(res, { copyAgent: { text: "hello", counter: 3 } });
});
