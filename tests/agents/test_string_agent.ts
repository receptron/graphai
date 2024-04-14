import { stringTemplateAgent } from "@/experimental_agents";

import test from "node:test";
import assert from "node:assert";

test("test stringTemplateAgent simple", async () => {
  const result = await stringTemplateAgent({
    nodeId: "test",
    retry: 0,
    params: { template: "${0}: ${1}" },
    inputs: [{ content: "hello" }, { content: "test" }],
    verbose: true,
    agents: {},
  });
  assert.deepStrictEqual(result, {
    content: "hello: test",
  });
});

test("test stringTemplateAgent simple", async () => {
  const result = await stringTemplateAgent({
    nodeId: "test",
    retry: 0,
    params: { template: "${0}: ${1}", inputKey: "key" },
    inputs: [{ key: "hello" }, { key: "test" }],
    verbose: true,
    agents: {},
  });
  assert.deepStrictEqual(result, {
    content: "hello: test",
  });
});
