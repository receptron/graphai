import { stringTemplateAgent, stringSplitterAgent } from "@/experimental_agents";
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

test("test stringSplitterAgent simple", async () => {
  const result = await stringSplitterAgent({
    ...defaultTestContext,
    params: { },
    inputs: [{ content: "hello" }],
  });
  assert.deepStrictEqual(result, {
    contents: ["hello"],
    count: 1,
    chunkSize: 2048,
    overlap: 256,
  });
});
