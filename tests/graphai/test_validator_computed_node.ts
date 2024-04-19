import { graphDataTestRunner } from "~/utils/runner";
import { echoAgent } from "~/agents/agents";

import test from "node:test";
import assert from "node:assert";

const anonymization = (data: Record<string, any>) => {
  return JSON.parse(JSON.stringify(data));
};

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        value: {},
        agentId: "echoAgent",
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, { echoAgent });
    },
    { name: "Error", message: "Computed node does not allow value" },
  );
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
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, { echoAgent });
    },
    { name: "Error", message: "Computed node does not allow update" },
  );
});
