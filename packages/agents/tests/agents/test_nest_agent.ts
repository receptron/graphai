import { nestedAgent, sleeperAgent } from "@/index";
import { defaultTestContext } from "graphai";

import test from "node:test";
import assert from "node:assert";

test("test nest agent", async () => {
  const result = await nestedAgent.agent({
    ...defaultTestContext,
    agents: { sleeperAgent },
    graphData: {
      version: 0.3,
      nodes: {
        node1: {
          agent: "sleeperAgent",
          inputs: [":prop1", ":prop2", ":prop3"],
          isResult: true,
        },
      },
    },
    namedInputs: { prop1: { apple: "red" }, prop2: { lemon: "yellow" }, prop3: { orange: "orange" } },
    inputs: [],
    inputSchema: undefined,
  });
  assert.deepStrictEqual(result, {
    node1: { apple: "red", lemon: "yellow", orange: "orange" },
  });
});
