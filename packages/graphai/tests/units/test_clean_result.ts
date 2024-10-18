import { cleanResult } from "../../src/result";

import test from "node:test";
import assert from "node:assert";

test("test clean result empty array", async () => {
  const data = { a: [], b: [1, 2] };
  const expect = { b: [1, 2] };

  const result = cleanResult(data);
  assert.deepStrictEqual(result, expect);
});

test("test clean result value", async () => {
  const data = { a: undefined, b: null, c: 1, d: false, e: true, f: "1", g: "", h: {}, i: [] } as any;
  const expect = { c: 1, d: false, e: true, f: "1", g: "" };

  const result = cleanResult(data);
  assert.deepStrictEqual(result, expect);
});

test("test clean result object value", async () => {
  const data = { data: { a: undefined, b: null, c: 1, d: false, e: true, f: "1", g: "", h: {}, i: [] } } as any;
  const expect = { data: { c: 1, d: false, e: true, f: "1", g: "" } };

  const result = cleanResult(data);
  assert.deepStrictEqual(result, expect);
});

test("test clean result array value", async () => {
  const data = { array: [undefined, null, 1, false, true, "1", "", {}, []] } as any;
  const expect = { array: [1, false, true, "1", ""] };

  const result = cleanResult(data);
  assert.deepStrictEqual(result, expect);
});
