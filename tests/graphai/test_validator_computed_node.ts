import { rejectTest } from "~/utils/runner";
import { anonymization } from "~/utils/utils";

import test from "node:test";

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: {
      computed1: {
        value: {},
        agent: "echoAgent",
      },
    },
  });
  await rejectTest(graph_data, "Cannot set both agent and value");
});

test("test static node validation value", async () => {
  const graph_data = anonymization({
    version: 0.3,
    nodes: {
      computed1: {
        update: "",
        agent: "echoAgent",
      },
    },
  });
  await rejectTest(graph_data, "Computed node does not allow update");
});
