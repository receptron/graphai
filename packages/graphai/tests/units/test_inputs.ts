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
      agent: "nestedAgent",
      params: {
        namedInput: [
          "a", "b", "c",
        ],
      },
      inputs: {
        a: [":message"],
        b: [],
        c: ""
      },
      graph: {
        nodes: {
          test: {
            inputs: {
              a: ":a",
              b: ":b",
              c: ":c",
            },
            agent: (input: string) => {
              console.log(input)
              return input
            },
            isResult: true,
          },
        },
      },
      isResult: true,
    },
    namedResult: {
      agent: (object: { input: string }) => object.input,
      inputs: { input: ":message" },
      isResult: true,
    },
  },
};

test("test named inputs", async () => {
  const graph = new GraphAI(graph_data, { nestedAgent }, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { result: "Hello World", namedResult: "Hello World" });
});
