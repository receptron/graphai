import { nestedAgent, sleeperAgent, gloqAgent } from "@/experimental_agents";
import { defaultTestContext } from "@/utils/test_utils";

import test from "node:test";
import assert from "node:assert";

test("test dataObjectMergeTemplateAgent", async () => {
  const run = async (inputs: ["Who is Steve Jobs?"]) => {
    return await gloqAgent({
      inputs,
      ...defaultTestContext,
      params: {
        model: "foo"
      },
    });
  };
});
