import { rejectTest } from "~/utils/runner";
import { anonymization } from "~/utils/utils";

import test from "node:test";

test("test validation no data", async () => {
  const graph_data = anonymization({});
  await rejectTest(graph_data, "Invalid Graph Data: no nodes");
});

test("test validation nodes is array", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: [],
  });
  await rejectTest(graph_data, "Invalid Graph Data: nodes must be object");
});

test("test validation nodes is empty", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: {},
  });
  await rejectTest(graph_data, "Invalid Graph Data: nodes is empty");
});

test("test validation nodes is not object", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: "123",
  });
  await rejectTest(graph_data, "Invalid Graph Data: invalid nodes");
});

test("test validation invalid agent", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: {
      invalidAgent: {
        agent: "NonExistAgent",
      },
    },
  });
  await rejectTest(graph_data, "Invalid Agent : NonExistAgent is not in callbackDictonary.");
});

test("test validation invalid agent", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: {
      nodeTest: {},
    },
  });
  await rejectTest(graph_data, "Either agent or value is required");
});

test("test validation invalid agent", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: {
      nodeTest: {
        value: {},
        agent: "123",
      },
    },
  });
  await rejectTest(graph_data, "Cannot set both agent and value");
});
