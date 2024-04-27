import { graphDataTestRunner } from "~/utils/runner";
import { sleeperAgent } from "@/experimental_agents";

import test from "node:test";
import assert from "node:assert";

const graphdata_inputs = {
  nodes: {
    apple: {
      value: { fruits: { apple: "red" } },
    },
    lemon: {
      value: { fruits: { lemon: "yellow" } },
    },
    total: {
      agentId: "sleeperAgent",
      inputs: ["apple", "lemon", "apple.fruits", "lemon.fruits"],
    },
  },
};

test("test loop & push", async () => {
  const result = await graphDataTestRunner("test_inputs", graphdata_inputs, { sleeperAgent }, () => {}, true);
  assert.deepStrictEqual(result, {
    apple: { fruits: { apple: "red" } },
    lemon: { fruits: { lemon: "yellow" } },
    total: {
      fruits: { apple: "red", lemon: "yellow" },
      apple: "red",
      lemon: "yellow",
    },
  });
});
