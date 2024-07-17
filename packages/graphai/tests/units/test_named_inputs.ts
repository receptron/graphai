import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    result: {
      agent: (input: string) => input,
      inputs: [":message"],
      isResult: true,
    },
    namedResult: {
      agent: (object: { input: string }) => object.input,
      inputs: { input: ":message" },
      isResult: true,
    },
  },
};

import test from "node:test";
import assert from "node:assert";

test("test named inputs", async () => {
  const graph = new GraphAI(graph_data, {}, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { result: "Hello World", namedResult: "Hello World" });
});
