import { system_with_response_format } from "../src/anthropic_agent";

import test from "node:test";
import assert from "node:assert";

test("test response_format with system prompt", async () => {
  const system = ["hello"];
  const response_format = { test: "aaa" };
  const ret = system_with_response_format(system, response_format);
  const expect = 'Please return the following json object for the specified content.\n{\n  "test": "aaa"\n}\n\n<description>\nhello\n</description>';
  assert.deepStrictEqual(ret, expect);
});

test("test response_format", async () => {
  const system = undefined;
  const response_format = { test: "aaa" };
  const ret = system_with_response_format(system, response_format);
  const expect = 'Please return the following json object for the specified content.\n{\n  "test": "aaa"\n}';
  assert.deepStrictEqual(ret, expect);
});

test("test system prompt", async () => {
  const system = ["hello"];
  const response_format = undefined;
  const ret = system_with_response_format(system, response_format);
  const expect = system;
  assert.deepStrictEqual(ret, expect);
});
