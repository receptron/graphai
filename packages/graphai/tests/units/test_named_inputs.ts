import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";

import test from "node:test";
import assert from "node:assert";

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

const graph_data_array_named_input = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    message2: {
      value: "Hello World2",
    },
    result: {
      agent: (input: string) => input,
      inputs: [":message"],
      isResult: true,
    },
    namedResult: {
      agent: (object: { input: string }) => object.input,
      inputs: { input: [":message", ":message2"] },
      isResult: true,
    },
  },
};

const graph_data_nested_named_input = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    message2: {
      value: "Hello World2",
    },
    result: {
      agent: (input: string) => input,
      inputs: [":message"],
      isResult: true,
    },
    namedResult: {
      agent: (object: { input: string }) => object.input,
      inputs: { input: [[[":message"], ":message2"]] },
      isResult: true,
    },
  },
};

test("test named inputs", async () => {
  const graph = new GraphAI(graph_data, {}, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { result: "Hello World", namedResult: "Hello World" });
});

test("test named inputs array", async () => {
  const graph = new GraphAI(graph_data_array_named_input, {}, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { result: "Hello World", namedResult: ["Hello World", "Hello World2"] });
});

test("test nested named inputs array", async () => {
  const graph = new GraphAI(graph_data_nested_named_input, {}, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { result: "Hello World", namedResult: [[["Hello World"], "Hello World2"]] });
});
