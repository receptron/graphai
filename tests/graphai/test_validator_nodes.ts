import { graphDataTestRunner } from "~/utils/runner";
import { anonymization } from "~/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test validation no data", async () => {
  const graph_data = anonymization({});
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, {});
    },
    { name: "Error", message: "Invalid Graph Data: no nodes" },
  );
});

test("test validation nodes is array", async () => {
  const graph_data = anonymization({
    nodes: [],
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, {});
    },
    { name: "Error", message: "Invalid Graph Data: nodes must be object" },
  );
});

test("test validation nodes is empty", async () => {
  const graph_data = anonymization({
    nodes: {},
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, {});
    },
    { name: "Error", message: "Invalid Graph Data: nodes is empty" },
  );
});

test("test validation nodes is not object", async () => {
  const graph_data = anonymization({
    nodes: "123",
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, {});
    },
    { name: "Error", message: "Invalid Graph Data: invalid nodes" },
  );
});

test("test validation invalid agent", async () => {
  const graph_data = anonymization({
    nodes: {
      invalidAgent: {
        agentId: "NonExistAgent",
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, {});
    },
    { name: "Error", message: "Invalid AgentId : NonExistAgent is not in callbackDictonary." },
  );
});

test("test validation invalid agent", async () => {
  const graph_data = anonymization({
    nodes: {
      nodeTest: {},
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, {});
    },
    { name: "Error", message: "Either agentId or value is required" },
  );
});

test("test validation invalid agent", async () => {
  const graph_data = anonymization({
    nodes: {
      nodeTest: {
        value: {},
        agentId: "123",
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, {});
    },
    { name: "Error", message: "Cannot set both agentId and value" },
  );
});
