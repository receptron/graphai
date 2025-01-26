import "dotenv/config";
import { defaultTestContext } from "graphai";
import { openAIAgent } from "@/openai_agent";

import test from "node:test";
import assert from "node:assert";

test("test oolama", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };

  // const model = "gemma";
  const model = "llama3";
  const params = {
    baseURL: "http://127.0.0.1:11434/v1",
  };
  const config = {
    model,
  };

  const res = (await openAIAgent({ ...defaultTestContext, namedInputs, params, config })) as any;
  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});
