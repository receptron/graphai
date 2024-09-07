import "dotenv/config";
import { groqAgent } from "@/groq_agent";

import test from "node:test";
import assert from "node:assert";

test("test groq", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const params = { model: "llama3-8b-8192" };
  const res = (await groqAgent({ inputs: [], namedInputs, params, filterParams: {}, debugInfo: { verbose: false, nodeId: "test", retry: 5 } })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});
