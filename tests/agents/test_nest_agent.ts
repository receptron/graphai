import { nestedAgent, sleeperAgent } from "@/experimental_agents";
import { defaultTestContext } from "@/utils/test_utils";

import test from "node:test";
import assert from "node:assert";

test("test nest agent", async () => {
  const result = await nestedAgent({
    ...defaultTestContext,
    agents: { sleeperAgent },
    graphData: {
      nodes: {
        node1: {
          agentId: "sleeperAgent",
          inputs: ["$0", "$1", "$2"],
          isResult: true,
        },
      },
    },
    inputs: [{ apple: "red" }, { lemon: "yellow" }, { orange: "orange" }],
  });
  assert.deepStrictEqual(result, {
    node1: { apple: "red", lemon: "yellow", orange: "orange" },
  });
});
