import { GraphAI, assert as GraphaiAssert } from "../../src/index";

import * as agents from "../test_agents";

import { graphDataLatestVersion } from "../common";
import { anonymization } from "@receptron/test_utils";

import test from "node:test";
import assert from "node:assert";

test("test throw error: agent throw error", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          message: "hello",
        },
      },
      errorNode: {
        agent: async (__namedInputs: { text: string }) => {
          throw new Error("hello");
        },
        inputs: { text: ":echo.message" },
      },
    },
  };

  const graph = new GraphAI(graph_data, { ...agents });
  try {
    await graph.run();
  } catch (__error) {
    // nothing
  }
  assert.equal(graph.nodes.errorNode.state, "failed");
});

test("test throw error: validation error", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          message: "hello",
        },
      },
      invalidInput: {
        agent: "copyAgent",
        inputs: "123",
      },
    },
  });

  await assert.rejects(
    async () => {
      const graph = new GraphAI(graph_data, { ...agents });
      await graph.run();
    },
    { name: "Error", message: "sources must be array!! maybe inputs is invalid" },
  );
});

test("test throw error: loop", async () => {
  let counter = 0;
  const graph_data = {
    version: graphDataLatestVersion,
    loop: {
      count: 2,
    },
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          message: "hello",
        },
      },
      errorNode: {
        agent: async (__namedInputs: { text: string }) => {
          counter = counter + 1;
          throw new Error("hello");
        },
        inputs: { text: ":echo.message" },
      },
    },
  };

  const graph = new GraphAI(graph_data, { ...agents });
  try {
    await graph.run();
  } catch (__error) {
    // nothing
  }
  assert.equal(counter, 1);
  assert.equal(graph.nodes.errorNode.state, "failed");
});

test("test throw error: force loop", async () => {
  let counter = 0;
  const graph_data = {
    version: graphDataLatestVersion,
    loop: {
      count: 2,
    },
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          message: "hello",
        },
      },
      errorNode: {
        agent: async (__namedInputs: { text: string }) => {
          counter = counter + 1;
          throw new Error("hello");
        },
        inputs: { text: ":echo.message" },
      },
    },
  };

  const graph = new GraphAI(graph_data, { ...agents }, { forceLoop: true });
  try {
    await graph.run();
  } catch (__error) {
    // nothing
  }
  assert.equal(counter, 2);
  assert.equal(graph.nodes.errorNode.state, "failed");
});

test("test throw error: cause", async () => {
  await assert.rejects(
    async () => {
      GraphaiAssert(false, "test", false, { type: "hello" });
    },
    { name: "Error", message: "test", cause: { type: "hello" } },
  );
});
