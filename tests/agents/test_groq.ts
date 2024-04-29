import { nestedAgent, sleeperAgent, gloqAgent } from "@/experimental_agents";
import { defaultTestContext } from "@/utils/test_utils";

import test from "node:test";
import assert from "node:assert";

test("test dataObjectMergeTemplateAgent", async () => {
  const result = await gloqAgent({
    ...defaultTestContext,
    params: { model: "foo" },
    inputs: ["hello"],
  });
  assert.deepStrictEqual(result, {
    content: "hello: test",
  });
});
