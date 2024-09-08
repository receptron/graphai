import "dotenv/config";
import { slashGPTAgent } from "@/slashgpt_agent";

import test from "node:test";
import assert from "node:assert";

test("test slashgpt", async () => {
  const params = { query: "Come up with ten business ideas for AI startup", manifest: {} as any };
  const res = (await slashGPTAgent({ inputs: [], namedInputs: {}, params, filterParams: {}, debugInfo: { verbose: false, nodeId: "test", retry: 5 } })) as any;

  if (res) {
    console.log(JSON.stringify(res, null, 2));
  }
  assert.deepStrictEqual(true, true);
});
