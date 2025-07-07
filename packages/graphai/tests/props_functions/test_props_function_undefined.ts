import { parseNodeName } from "../../src/utils/utils";
import { propFunctions } from "../../src/utils/prop_function";
import { getDataFromSource } from "../../src/utils/data_source";

import test from "node:test";
import assert from "node:assert";

// undefined function
test("test getDataFromSource undefined", async () => {
  const inputId = ":node1.data.default(123)";
  const result = { data: undefined };
  const data = 123;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "default(123)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource undefined", async () => {
  const inputId = ":node1.data.default(-123)";
  const result = { data: undefined };
  const data = -123;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "default(-123)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource undefined", async () => {
  const inputId = ":node1.data.default(abc)";
  const result = { data: undefined };
  const data = "abc";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "default(abc)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});
