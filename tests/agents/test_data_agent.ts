import { dataObjectMergeTemplateAgent, dataSumTemplateAgent } from "@/experimental_agents";

import test from "node:test";
import assert from "node:assert";

test("test dataObjectMergeTemplateAgent", async () => {
  const result = await dataObjectMergeTemplateAgent({
    nodeId: "merge",
    retry: 0,
    params: {},
    inputs: [{ content1: "hello" }, { content2: "test" }],
    verbose: true,
    agents: {},
    log: [],
  });
  assert.deepStrictEqual(result, {
    content1: "hello",
    content2: "test",
  });
});

test("test dataSumTemplateAgent", async () => {
  const result = await dataSumTemplateAgent({
    nodeId: "test",
    retry: 0,
    params: {},
    inputs: [1, 2],
    verbose: true,
    agents: {},
    log: [],
  });
  assert.deepStrictEqual(result, 3);
});
