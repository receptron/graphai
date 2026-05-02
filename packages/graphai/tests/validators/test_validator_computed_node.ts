import { anonymization, rejectTest } from "@receptron/test_utils";
import { graphDataLatestVersion } from "../common";

import test from "node:test";

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      computed1: {
        value: {},
        agent: "echoAgent",
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Cannot set both agent and value");
});

test("test static node validation value", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      computed1: {
        update: "",
        agent: "echoAgent",
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Computed node does not allow update");
});

test("test computed node label must be a string", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      computed1: {
        agent: "echoAgent",
        label: 5,
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Computed node label must be a string");
});

test("test computed node label string is valid", async () => {
  const { validateGraphData } = await import("../../src/validator");
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      computed1: {
        agent: "echoAgent",
        label: "openai",
      },
    },
  };
  validateGraphData(graph_data, ["echoAgent"]);
});
