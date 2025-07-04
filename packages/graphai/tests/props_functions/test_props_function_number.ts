import { parseNodeName } from "../../src/utils/utils";
import { propFunctions } from "../../src/utils/prop_function";
import { getDataFromSource } from "../../src/utils/data_source";

import test from "node:test";
import assert from "node:assert";

// number function
test("test getDataFromSource number", async () => {
  const inputId = ":node1.data.toString()";
  const result = { data: 1 };
  const data = "1";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "toString()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string equal", async () => {
  const inputId = ":node1.data.equal(12)";
  const result = { data: 12 };
  const data = true;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "equal(12)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string equal", async () => {
  const inputId = ":node1.data.equal(12)";
  const result = { data: 11 };
  const data = false;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "equal(12)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});
