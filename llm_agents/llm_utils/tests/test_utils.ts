import { flatString, getMergeValue } from "@/index";

import test from "node:test";
import assert from "node:assert";

test("test flatString", async () => {
  const res1 = flatString("test");
  assert.deepStrictEqual(res1, "test");

  const res2 = flatString(["test"]);
  assert.deepStrictEqual(res2, "test");

  const res3 = flatString(["test1", "test2"]);
  assert.deepStrictEqual(res3, "test1\ntest2");

  const res4 = flatString([undefined, "test2"]);
  assert.deepStrictEqual(res4, "test2");

  const res5 = flatString(["test1", undefined]);
  assert.deepStrictEqual(res5, "test1");

  const res6 = flatString(undefined);
  assert.deepStrictEqual(res6, "");

  const res7 = flatString([undefined]);
  assert.deepStrictEqual(res7, "");
});

test("test getMergeValue", async () => {
  const res1 = getMergeValue({ mergeablePrompts: "input1" }, { mergeablePrompts: "param1" }, "mergeablePrompts", "");
  assert.deepStrictEqual(res1, "input1\nparam1");

  const res2 = getMergeValue({ mergeablePrompts: ["input1", "input2"] }, { mergeablePrompts: "param1" }, "mergeablePrompts", "prompt1");
  assert.deepStrictEqual(res2, "input1\ninput2\nparam1");

  const res3 = getMergeValue({}, {}, "mergeablePrompts", "prompt1");
  assert.deepStrictEqual(res3, "prompt1");

  const res4 = getMergeValue({ mergeablePrompts: undefined }, { mergeablePrompts: "param1" }, "mergeablePrompts", "prompt1");
  assert.deepStrictEqual(res4, "param1");
});
