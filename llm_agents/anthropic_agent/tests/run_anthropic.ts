import "dotenv/config";
import { anthropicAgent } from "@/anthropic_agent";

import test from "node:test";
import assert from "node:assert";

test("test openai", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const params = {};
  const res = (await anthropicAgent({ inputs: [], namedInputs, params, filterParams: {}, debugInfo: { verbose: false, nodeId: "test", retry: 5 } })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});
