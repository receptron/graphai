import { stringTemplateAgent } from "@/experimental_agents";
import { defaultTestContext } from "~/agents/utils";

import test from "node:test";
import assert from "node:assert";

test("test stringTemplateAgent simple", async () => {
  const result = await stringTemplateAgent({
    ...defaultTestContext,
    params: { template: "${0}: ${1}" },
    inputs: [{ content: "hello" }, { content: "test" }],
  });
  assert.deepStrictEqual(result, {
    content: "hello: test",
  });
});

test("test stringTemplateAgent simple", async () => {
  const result = await stringTemplateAgent({
    ...defaultTestContext,
    params: { template: "${0}: ${1}", inputKey: "key" },
    inputs: [{ key: "hello" }, { key: "test" }],
  });
  assert.deepStrictEqual(result, {
    content: "hello: test",
  });
});
