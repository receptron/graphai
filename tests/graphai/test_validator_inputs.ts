import { graphDataTestRunner } from "~/utils/runner";
import { echoAgent } from "~/agents/agents";
import { anonymization } from "~/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        agentId: "echoAgent",
      },
      computed2: {
        agentId: "echoAgent",
        inputs: ["dummy"],
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, { echoAgent });
    },
    { name: "Error", message: "Inputs not match: NodeId computed2, Inputs: dummy" },
  );
});
