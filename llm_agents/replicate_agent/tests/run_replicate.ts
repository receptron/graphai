import "dotenv/config";
import { replicateAgent } from "@/replicate_agent";

import test from "node:test";
import assert from "node:assert";

test("test replicateAgent", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const params = { model: "meta/meta-llama-3-70b-instruct" };
  const res = (await replicateAgent({ inputs: [], namedInputs, params, filterParams: {}, debugInfo: { verbose: false, nodeId: "test", retry: 5 } })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});
