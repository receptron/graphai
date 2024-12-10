import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";
import * as agents from "~/test_agents";

import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    messages: {
      value: [],
      update: ":reducer.array",
    },
    message: {
      value: {
        text: "Hello World",
      },
    },
    result: {
      agent: "copyAgent",
      inputs: {
        text: ":message.text",
      },
      isResult: true,
    },
    reducer: {
      // Appends the responce to the messages.
      agent: "pushAgent",
      inputs: { array: ":messages", item: ":result.text" },
      isResult: true,
    },
  },
};

test("test manually loop", async () => {
  const graph = new GraphAI(graph_data, agents);
  const result = await graph.run();
  assert.deepStrictEqual(result, {
    reducer: {
      array: ["Hello World"],
    },
    result: {
      text: "Hello World",
    },
  });

  // manually loop
  graph.initializeGraphAI({ reducer: { array: ["this is test"] } });
  const result2 = await graph.run();
  assert.deepStrictEqual(result2, {
    reducer: {
      array: ["this is test", "Hello World"],
    },
    result: {
      text: "Hello World",
    },
  });
});

test("test manually loop", async () => {
  const graph = new GraphAI(graph_data, agents);
  graph.initializeGraphAI({ reducer: { array: ["this is test"] } });
  const result = await graph.run();
  assert.deepStrictEqual(result, {
    reducer: {
      array: ["this is test", "Hello World"],
    },
    result: {
      text: "Hello World",
    },
  });
});

test("test manually loop: initializeGraphAI is not called when node is running", async () => {
  const graph = new GraphAI(graph_data, agents);
  graph.run();
  await assert.rejects(
    async () => {
      graph.initializeGraphAI({ reducer: { array: ["this is test"] } });
    },
    { name: "Error", message: "This GraphAI instance is running" },
  );
});
