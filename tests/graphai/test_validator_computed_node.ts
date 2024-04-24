import { rejectTest } from "~/utils/runner";
import { defaultTestAgents } from "~/agents/agents";
import { anonymization } from "~/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        value: {},
        agentId: "echoAgent",
      },
    },
  });
  await rejectTest(graph_data, "Cannot set both agentId and value");
});

test("test static node validation value", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        update: "",
        agentId: "echoAgent",
      },
    },
  });
  await rejectTest(graph_data, "Computed node does not allow update");
});
