import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";
import { copyAgent } from "../test_agents";
import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    inject1: {},
    inject2: {},
    result: {
      agent: "copyAgent",
      inputs: {
        array: [":inject1", ":inject2"],
      },
      isResult: true,
    },
  },
};

test("test injection static node", async () => {
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

test("test injection static node", async () => {
  console.log(graph_data);
  const graph = new GraphAI(graph_data, { copyAgent }, {});
  await assert.rejects(
    async () => {
      const result = await graph.run();
    },
    { name: "Error", message: "Static node must have value. Set value or injectValue or set update" },
  );
});
