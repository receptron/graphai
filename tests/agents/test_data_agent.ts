import { dataObjectMergeTemplateAgent, dataSumTemplateAgent, totalAgent } from "@/experimental_agents";
import { defaultTestContext } from "~/agents/utils";

import test from "node:test";
import assert from "node:assert";

test("test dataObjectMergeTemplateAgent", async () => {
  const run = async (inputs: Array<Record<string, any>>) => {
    return await dataObjectMergeTemplateAgent({
      inputs,
      ...defaultTestContext,
    });
  };

  const r1 = await run([{ content1: "hello" }, { content2: "test" }]);
  assert.deepStrictEqual(r1, {
    content1: "hello",
    content2: "test",
  });

  const r2 = await run([{ content1: "hello" }]);
  assert.deepStrictEqual(r2, {
    content1: "hello",
  });

  const r3 = await run([{ content: "hello1" }, { content: "hello2" }]);
  assert.deepStrictEqual(r3, {
    content: "hello2",
  });
});

test("test dataSumTemplateAgent", async () => {
  const run = async (inputs: number[]) => {
    return await dataSumTemplateAgent({
      inputs,
      ...defaultTestContext,
    });
  };

  assert.deepStrictEqual(await run([1]), 1);

  assert.deepStrictEqual(await run([1, 2]), 3);

  assert.deepStrictEqual(await run([1, 2, 3]), 6);
});


test("test totalAgentdataSumTemplateAgent", async () => {
  const run = async (inputs: number[]) => {
    return await dataSumTemplateAgent({
      inputs,
      ...defaultTestContext,
    });
  };

  assert.deepStrictEqual(await run([1]), 1);

  assert.deepStrictEqual(await run([1, 2]), 3);

  assert.deepStrictEqual(await run([1, 2, 3]), 6);
});
