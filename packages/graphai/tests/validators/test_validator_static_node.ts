import { anonymization, rejectTest } from "@receptron/test_utils";

import test from "node:test";

import { graphDataLatestVersion } from "~/common";

test("test static node validation inputs", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      static1: {
        value: {},
        inputs: [""],
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Static node does not allow inputs");
});

test("test static node validation anyInput", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      static1: {
        value: {},
        anyInput: true,
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Static node does not allow anyInput");
});

test("test static node validation params", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      static1: {
        value: {},
        params: {},
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Static node does not allow params");
});

test("test static node validation retry", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      static1: {
        value: {},
        retry: 1,
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Static node does not allow retry");
});

test("test static node validation timeout", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      static1: {
        value: {},
        timeout: 1,
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Static node does not allow timeout");
});

test("test static node validation update", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      static1: {
        value: {},
        update: ":unknown",
      },
      computed1: {
        agent: "echoAgent",
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Update not match: NodeId static1, update: :unknown");
});

test("test static node validation update", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    nodes: {
      static1: {
        value: {},
        update: ":unknown.param1",
      },
      computed1: {
        agent: "echoAgent",
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Update not match: NodeId static1, update: :unknown.param1");
});
