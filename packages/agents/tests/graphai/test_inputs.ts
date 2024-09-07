import { graphDataTestRunner } from "@receptron/test_utils";
import { sleeperAgent } from "@/index";

import { graphDataInputs } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test input", async () => {
  const result = await graphDataTestRunner(__dirname, "test_inputs", graphDataInputs, { sleeperAgent }, () => {}, true);
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
