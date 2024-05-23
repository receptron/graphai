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
  assert.deepStrictEqual(res, [":agentABC", ":agentABC.data"]);
});

test("test object", async () => {
  const agentId = "agentABC";
  const result = { data: [1, 2], data2: { hoge: "aa", foo: { bar: { boo: "bb" } } } };
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [
    ":agentABC",
    ":agentABC.data",
    ":agentABC.data.$0",
    ":agentABC.data.$1",
    ":agentABC.data2",
    ":agentABC.data2.hoge",
    ":agentABC.data2.foo",
    ":agentABC.data2.foo.bar",
    ":agentABC.data2.foo.bar.boo",
  ]);
});

test("test null", async () => {
  const agentId = "agentABC";
  const result = null;
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [":agentABC"]);
});

test("test undefined", async () => {
  const agentId = "agentABC";
  const result = undefined;
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [":agentABC"]);
});

test("test string", async () => {
  const agentId = "agentABC";
  const result = "123";
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [":agentABC"]);
});

test("test number", async () => {
  const agentId = "agentABC";
  const result = 123;
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [":agentABC"]);
});

test("test llm object", async () => {
  const agentId = "agentABC";
  const result = {
    id: "chatcmpl-3d74d4cd-3645-4953-a8c0-691024f3ce65",
    object: "chat.completion",
    created: 1716007503,
    model: "llama3-8b-8192",
    choices: [
      {
        index: 0,
        message: [],
        logprobs: null,
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 561,
      prompt_time: 0.147,
      completion_tokens: 218,
      completion_time: 0.26,
      total_tokens: 779,
      total_time: 0.40700000000000003,
    },
    system_fingerprint: "fp_873a560973",
    x_groq: { id: "req_01hy5091abfk3rafak48zsp1pw" },
  };
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [
    ":agentABC",
    ":agentABC.id",
    ":agentABC.object",
    ":agentABC.created",
    ":agentABC.model",
    ":agentABC.choices",
    ":agentABC.choices.$0",
    ":agentABC.choices.$0.index",
    ":agentABC.choices.$0.message",
    ":agentABC.choices.$0.logprobs",
    ":agentABC.choices.$0.finish_reason",
    ":agentABC.usage",
    ":agentABC.usage.prompt_tokens",
    ":agentABC.usage.prompt_time",
    ":agentABC.usage.completion_tokens",
    ":agentABC.usage.completion_time",
    ":agentABC.usage.total_tokens",
    ":agentABC.usage.total_time",
    ":agentABC.system_fingerprint",
    ":agentABC.x_groq",
    ":agentABC.x_groq.id",
  ]);
});
