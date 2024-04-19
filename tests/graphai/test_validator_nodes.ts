import { graphDataTestRunner } from "~/utils/runner";
import { anonymization } from "~/utils/utils";

import test from "node:test";
import assert from "node:assert";

const anonymization = (data: Record<string, any>) => {
  return JSON.parse(JSON.stringify(data));
};

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
