import "dotenv/config";
import { defaultTestContext } from "graphai";
import { openAIImageAgent } from "../src/openai_image_agent";

import test from "node:test";
import assert from "node:assert";

test("test openai", async () => {
  const namedInputs = { prompt: ["hello, japanese cat"] };
  const res = (await openAIImageAgent({ ...defaultTestContext, namedInputs })) as any;

  if (res) {
    console.log(res);
  }
  assert.deepStrictEqual(true, true);
});
