import { popAgent } from "@/index";

import test from "node:test";
import assert from "node:assert";
import { anonymization } from "@graphai/test_utils";

test("test pop_agent validator ok 1", async () => {
  const namedInputs = { array: [1, 2, 3] };
  const params = {};
  const res = await popAgent.agent({
    inputs: [],
    inputSchema: popAgent.inputs,
    namedInputs,
    params,
    filterParams: {},
    debugInfo: { verbose: false, nodeId: "test", retry: 5 },
  });
  assert.deepStrictEqual(res, { array: [1, 2], item: 3 });
});

test("test pop_agent validator ok 1", async () => {
  const namedInputs = { array: [{ a: 1 }, { a: 2 }, { a: 3 }] };
  const params = {};
  const res = await popAgent.agent({
    inputs: [],
    inputSchema: popAgent.inputs,
    namedInputs,
    params,
    filterParams: {},
    debugInfo: { verbose: false, nodeId: "test", retry: 5 },
  });
  assert.deepStrictEqual(res, { array: [{ a: 1 }, { a: 2 }], item: { a: 3 } });
});

test("test pop_agent validator error", async () => {
  const namedInputs = anonymization({ array: 1 });
  const params = {};

  await assert.rejects(
    async () => {
      await popAgent.agent({
        inputs: [],
        inputSchema: popAgent.inputs,
        namedInputs,
        params,
        filterParams: {},
        debugInfo: { verbose: false, nodeId: "test", retry: 5 },
      });
    },
    { name: "Error", message: "schema not matched" },
  );
});
