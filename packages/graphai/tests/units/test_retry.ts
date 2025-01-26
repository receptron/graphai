import { GraphAI } from "@/index";

import * as agents from "~/test_agents";

import { graphDataLatestVersion } from "~/common";

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
      agent: async (namedInputs: { text: string }) => {
        if (i < 2) {
          i++;
          throw new Error("hello");
        }
        return namedInputs.text;
      },
      inputs: { text: ":echo.message" },
    },
    copyAgent: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: ":retryNode" },
      isResult: true,
    },
  },
};

test("test retry", async () => {
  const graph = new GraphAI(graph_data, { ...agents });
  const res = await graph.run();

  // console.log(JSON.stringify(res, null, 2));
  assert.deepStrictEqual(res, { copyAgent: "hello" });
});
