import { parseNodeName } from "@/utils/utils";
import { propFunction } from "@/utils/prop_function";
import { getDataFromSource } from "@/utils/data_source";

import test from "node:test";
import assert from "node:assert";

// function for object
test("test getDataFromSource nested object keys", async () => {
  const inputId = ":node1.data.sample.keys()";
  const result = { data: { sample: { a: "123", b: "abc" } } };
  const data = ["a", "b"];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "keys()"] });
  const res = getDataFromSource(result, source, [propFunction]);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource nested object values", async () => {
  const inputId = ":node1.data.sample.values()";
  const result = { data: { sample: { a: "123", b: "abc" } } };
  const data = ["123", "abc"];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "values()"] });
  const res = getDataFromSource(result, source, [propFunction]);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource nested object values", async () => {
  // An example that is not good because the order is not unique
  const inputId = ":node1.data.sample.values().$last";
  const result = { data: { sample: { a: "123", b: "abc" } } };
  const data = "abc";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "values()", "$last"] });
  const res = getDataFromSource(result, source, [propFunction]);
  assert.deepStrictEqual(res, data);
});
