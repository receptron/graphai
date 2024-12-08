import { anonymization, rejectTest } from "@receptron/test_utils";
import { graphDataLatestVersion } from "~/common";

import test from "node:test";

test("test graph injection value object", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    injections: {},
    nodes: {
      computed1: {
        agent: "echoAgent",
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Injections must be an array");
});

test("test graph injection value object", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    injections: [{}],
    nodes: {
      computed1: {
        agent: "echoAgent",
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Injection value must be string");
});

test("test graph injection value object", async () => {
  const graph_data = anonymization({
    version: graphDataLatestVersion,
    injections: [1],
    nodes: {
      computed1: {
        agent: "echoAgent",
      },
    },
  });
  await rejectTest(__dirname, graph_data, "Injection value must be string");
});
