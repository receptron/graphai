import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";
import { copyAgent } from "../test_agents";
import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: graphDataLatestVersion,
  injections: ["inject1", "inject2"],
  nodes: {
    result: {
      agent: "copyAgent",
      inputs: {
        array: [":inject1", ":inject2"],
      },
      isResult: true,
    },
  },
};

test("test named inputs", async () => {
  const graph = new GraphAI(graph_data, { copyAgent }, {});
  graph.injectValue("inject1", "hello");
  graph.injectValue("inject2", "good morning");

  const result = await graph.run();
  assert.deepStrictEqual(result, {
    result: {
      array: ["hello", "good morning"],
    },
  });
});
