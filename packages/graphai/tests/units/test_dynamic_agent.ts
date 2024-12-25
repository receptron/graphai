import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";
import { copyAgent } from "../test_agents";
import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "copyAgent",
    },
    test: {
      agent: ":message",
      inputs: {
        message: "hello",
      },
      isResult: true,
      console: true,
    },
  },
};

test("test named inputs", async () => {
  const graph = new GraphAI(graph_data, { copyAgent }, { bypassAgentIds: [":messageId"] });
  const result = await graph.run();
  assert.deepStrictEqual(result, {
    test: {
      message: "hello",
    },
  });
});
