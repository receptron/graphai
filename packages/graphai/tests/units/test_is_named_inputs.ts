import { isNamedInputs } from "@/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test namedInput", async () => {
  assert.deepStrictEqual(isNamedInputs({}), false);
  assert.deepStrictEqual(isNamedInputs("a"), false);
  assert.deepStrictEqual(isNamedInputs(":"), false);
  assert.deepStrictEqual(isNamedInputs(null), false);
  assert.deepStrictEqual(isNamedInputs(undefined), false);
  assert.deepStrictEqual(isNamedInputs(123), false);
  assert.deepStrictEqual(isNamedInputs([]), false);
  assert.deepStrictEqual(isNamedInputs(["123"]), false);

  assert.deepStrictEqual(isNamedInputs({ a: 1 }), true);
  assert.deepStrictEqual(isNamedInputs({ a: "1" }), true);
});
