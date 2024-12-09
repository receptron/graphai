import { parseNodeName } from "@/utils/utils";
import { propFunctions } from "@/utils/prop_function";
import { getDataFromSource } from "@/utils/data_source";

import test from "node:test";
import assert from "node:assert";

// function for array
test("test getDataFromSource array length", async () => {
  const inputId = ":node1.data.sample.length()";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = 4;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "length()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array join", async () => {
  const inputId = ":node1.data.sample.join(-)";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = "0-1-2-3";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "join(-)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array join ,", async () => {
  const inputId = ":node1.data.sample.join(,)";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = "0,1,2,3";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "join(,)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array join ,", async () => {
  const inputId = ":node1.data.sample.join()";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = "0123";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "join()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array join ,", async () => {
  const inputId = ":node1.data.sample.join( )";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = "0 1 2 3";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "join( )"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array flat", async () => {
  const inputId = ":node1.data.sample.flat()";
  const result = { data: { sample: [0, [1, [2, [3]]]] } };
  const data = [0, 1, [2, [3]]];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "flat()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array flat", async () => {
  const inputId = ":node1.data.sample.flat().flat()";
  const result = { data: { sample: [0, [1, [2, [3]]]] } };
  const data = [0, 1, 2, [3]];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "flat()", "flat()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array to_json", async () => {
  const inputId = ":node1.data.toJSON()";
  const result = { data: { sample: [0, [1, [2, [3]]]] } };
  const data = '{"sample":[0,[1,[2,[3]]]]}';

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "toJSON()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array isEmpty", async () => {
  const inputId = ":node1.data.isEmpty()";
  const result = { data: [0, 1, 2] };
  const data = false;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "isEmpty()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array isEmpty2", async () => {
  const inputId = ":node1.data.isEmpty()";
  const result = { data: [] };
  const data = true;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "isEmpty()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});
