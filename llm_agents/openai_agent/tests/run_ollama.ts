import "dotenv/config";
import { openAIAgent } from "@/openai_agent";

import test from "node:test";
import assert from "node:assert";

test("test oolama", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  
  // const model = "gemma";
  const model = "llama3";
  // const model = "phi3";
  const params = {
    baseURL: "http://127.0.0.1:11434/v1",
    // apiKey: model,
  };
  const config = {
    model,
  };
  
  const res = (await openAIAgent({ namedInputs, params, filterParams: {}, debugInfo: { verbose: false, nodeId: "test", retry: 5 }, config })) as any;
  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});
