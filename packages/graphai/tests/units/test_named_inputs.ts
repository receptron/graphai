import { GraphAI } from "@/index";

const graph_data = {
  version: 0.3,
  nodes: {
    message: {
      value: "Hello World",
    },
    result: {
      agent: (object: any) => object.input,
      inputs: { input: ":message" },
      isResult: true,
    }
  },
};

import test from "node:test";
import assert from "node:assert";

test("test named inputs", async () => {
  const graph = new GraphAI(graph_data, {},  {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { result: "Hello World" });
});