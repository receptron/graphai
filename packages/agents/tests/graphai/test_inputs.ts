import { graphDataTestRunner } from "@receptron/test_utils";
import { sleeperAgent } from "@/index";

import test from "node:test";
import assert from "node:assert";

const graphdata_inputs = {
  version: 0.5,
  nodes: {
    apple: {
      value: { fruits: { apple: "red" } },
    },
    lemon: {
      value: { fruits: { lemon: "yellow" } },
    },
    total: {
      agent: "sleeperAgent",
      inputs: [":apple", ":lemon", ":apple.fruits", ":lemon.fruits"],
    },
  },
};

test("test loop & push", async () => {
  const result = await graphDataTestRunner(__dirname, "test_inputs", graphdata_inputs, { sleeperAgent }, () => {}, true);
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
