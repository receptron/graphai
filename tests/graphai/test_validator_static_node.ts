import { rejectTest } from "~/utils/runner";
import { anonymization } from "~/utils/utils";

import test from "node:test";

test("test static node validation inputs", async () => {
  const graph_data = anonymization({
    version: 0.2,
    nodes: {
      static1: {
        value: {},
        inputs: [""],
      },
    },
  });
  await rejectTest(graph_data, "Static node does not allow inputs");
});

test("test static node validation anyInput", async () => {
  const graph_data = anonymization({
    version: 0.2,
    nodes: {
      static1: {
        value: {},
        anyInput: true,
      },
    },
  });
  await rejectTest(graph_data, "Static node does not allow anyInput");
});

test("test static node validation params", async () => {
  const graph_data = anonymization({
    version: 0.2,
    nodes: {
      static1: {
        value: {},
        params: {},
      },
    },
  });
  await rejectTest(graph_data, "Static node does not allow params");
});

test("test static node validation retry", async () => {
  const graph_data = anonymization({
    version: 0.2,
    nodes: {
      static1: {
        value: {},
        retry: 1,
      },
    },
  });
  await rejectTest(graph_data, "Static node does not allow retry");
});

test("test static node validation timeout", async () => {
  const graph_data = anonymization({
    version: 0.2,
    nodes: {
      static1: {
        value: {},
        timeout: 1,
      },
    },
  });
  await rejectTest(graph_data, "Static node does not allow timeout");
});

test("test static node validation update", async () => {
  const graph_data = anonymization({
    version: 0.2,
    nodes: {
      static1: {
        value: {},
        update: "unknown",
      },
      computed1: {
        agentId: "echoAgent",
      },
    },
  });
  await rejectTest(graph_data, "Update not match: NodeId static1, update: unknown");
});

test("test static node validation update", async () => {
  const graph_data = anonymization({
    version: 0.2,
    nodes: {
      static1: {
        value: {},
        update: "unknown.param1",
      },
      computed1: {
        agentId: "echoAgent",
      },
    },
  });
  await rejectTest(graph_data, "Update not match: NodeId static1, update: unknown.param1");
});
