import { anonymization, rejectTest } from "@receptron/test_utils";
import { graphDataLatestVersion } from "~/common";

import test from "node:test";

test("test validation no data", async () => {
  const graph_data = anonymization({});
  await rejectTest(__dirname, graph_data, "Invalid Graph Data: no nodes");
});

test("test validation nodes is array", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: [],
  });
  await rejectTest(__dirname, graph_data, "Invalid Graph Data: nodes must be object");
});

test("test validation nodes is empty", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {},
  });
  await rejectTest(__dirname, graph_data, "Invalid Graph Data: nodes is empty");
});

test("test validation nodes is not object", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: "123",
  });
  await rejectTest(__dirname, graph_data, "Invalid Graph Data: invalid nodes");
});

test("test validation invalid agent", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      invalidAgent: {
        agent: "NonExistAgent",
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Invalid Agent : NonExistAgent is not in AgentFunctionInfoDictionary.");
});

test("test validation invalid agent", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      nodeTest: {},
    },
  });
  await rejectTest(__dirname, graph_data, "Either agent or value is required");
});

test("test validation invalid agent", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      nodeTest: {
        value: {},
        agent: "123",
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Cannot set both agent and value");
});
