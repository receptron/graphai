import { sortObjectKeys } from "@/index";

import test from "node:test";
import assert from "node:assert";

test("test sort", async () => {
  const ret = sortObjectKeys({ b: "2", a: "1" });
  assert.deepStrictEqual(ret, { a: "1", b: "2" });
});

test("test sort", async () => {
  const ret = sortObjectKeys({ b: "2", a: "1", c: { b: "2", a: "1" }, d: { a: "1", b: "2" }, e: ["n", "r", "a", "v"] });
  assert.deepStrictEqual(ret, {
    a: "1",
    b: "2",
    c: {
      a: "1",
      b: "2",
    },
    d: {
      a: "1",
      b: "2",
    },
    e: ["n", "r", "a", "v"],
  });
});
