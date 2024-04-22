import { dotProductAgent } from "@/experimental_agents";
import { defaultTestContext } from "~/agents/utils";

import test from "node:test";
import assert from "node:assert";

test("test dotProductAgent", async () => {
  const result = await dotProductAgent({
    ...defaultTestContext,
    inputs: [
      {
        contents: [
          [1, 2],
          [2, 3],
        ],
      },
      { contents: [[1, 2]] },
    ],
  });
  assert.deepStrictEqual(result, {
    contents: [5, 8],
  });
});
