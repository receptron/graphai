import { stringTemplateAgent } from "@/experimental_agents";

import test from "node:test";
import assert from "node:assert";

test("test stringTemplateAgent", async () => {
  const result = await stringTemplateAgent({
    nodeId: "test",
    retry: 0,
    params: { template: "${0}: ${1}" },
    inputs: [{ content: "hello" }, { content: "test" }] as any,
  });
  assert.deepStrictEqual(result, {
    content: "hello: test",
  });
});
