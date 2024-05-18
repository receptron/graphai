import { debugResultKey } from "@/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test string", async () => {
  const agentId = "agentABC";
  const result = "123";
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [":agentABC"]);
});

test("test object", async () => {
  const agentId = "agentABC";
  const result = { data: "123" };
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [":agentABC.data"]);
});

test("test object", async () => {
  const agentId = "agentABC";
  const result = { data: [1, 2], data2: { hoge: "aa", foo: { bar: { boo: "bb" } } } };
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [":agentABC.data.$0", ":agentABC.data.$1", ":agentABC.data2.hoge", ":agentABC.data2.foo.bar.boo"]);
});
