import { dotProductAgent, sortByValuesAgent } from "@/experimental_agents";
import { defaultTestContext } from "@/utils/test_utils";

import test from "node:test";
import assert from "node:assert";

test("test dotProductAgent", async () => {
  const result = await dotProductAgent({
    ...defaultTestContext,
    inputs: [
      [
        [1, 2],
        [2, 3],
      ],
      [[1, 2]],
    ],
  });
  assert.deepStrictEqual(result, [5, 8]);
});

test("test sortByValuesAgent", async () => {
  const result = await sortByValuesAgent({
    ...defaultTestContext,
    inputs: [
      ["banana", "orange", "lemon", "apple"],
      [2, 5, 6, 4],
    ],
  });
  assert.deepStrictEqual(result, {
    contents: ["lemon", "orange", "apple", "banana"],
  });
});

test("test sortByValuesAgent 2", async () => {
  const result = await sortByValuesAgent({
    ...defaultTestContext,
    params: {
      assendant: true,
    },
    inputs: [
      ["banana", "orange", "lemon", "apple"],
      [2, 5, 6, 4],
    ],
  });
  assert.deepStrictEqual(result, {
    contents: ["banana", "apple", "orange", "lemon"],
  });
});
