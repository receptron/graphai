import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { fileBaseName } from "~/utils/file_utils";

import test from "node:test";
import assert from "node:assert";

const graphdata_push = {
  nodes: {
    source: {
      value: { yes: true, no: false, message: { apple: "red" } },
    },
    positive: {
      agentId: "sleeperAgent",
      anyInput: true,
      isResult: true,
      inputs: ["source.yes", "source.message"]
    },
    negative: {
      agentId: "sleeperAgent",
      anyInput: true,
      isResult: true,
      inputs: ["source.no", "source.message"]
    },
  },
};

test("test loop & push", async () => {
  const result = await graphDataTestRunner(__filename, graphdata_push, defaultTestAgents, () => {}, false);
  console.log(result);
  /*
  assert.deepStrictEqual(result, {
    // array: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
    // item: "hello",
    reducer: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
  });
  */
});
