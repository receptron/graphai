import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";
import { nestedAgent } from "../test_agents";
import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    result: {
      inputs: {
        text: ":message",
      },
      params: {
        opt: "123",
      },
      agent: (namedInput: any, params: any) => {
        return { ...namedInput, ...params };
      },
      isResult: true,
    },
  },
};

test("test named inputs", async () => {
  const graph = new GraphAI(graph_data, { nestedAgent }, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, {
    result: {
      opt: "123",
      text: "Hello World",
    },
  });
});
