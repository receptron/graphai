import { parseNodeName } from "../../src/utils/utils";
import { propFunctions } from "../../src/utils/prop_function";
import { getDataFromSource } from "../../src/utils/data_source";

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
  const data = JSON.stringify({ sample: [0, [1, [2, [3]]]] }, null, 2);

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

test("test getDataFromSource array average", async () => {
  const inputId = ":node1.data.average()";
  const result = { data: [1, 2, 3, 4] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "average()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 2.5);
});

test("test getDataFromSource array average empty", async () => {
  const inputId = ":node1.data.average()";
  const result = { data: [] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "average()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 0);
});

test("test getDataFromSource array sum", async () => {
  const inputId = ":node1.data.sum()";
  const result = { data: [1, 2, 3] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sum()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 6);
});

test("test getDataFromSource array max", async () => {
  const inputId = ":node1.data.max()";
  const result = { data: [1, 8, 3] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "max()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 8);
});

test("test getDataFromSource array min", async () => {
  const inputId = ":node1.data.min()";
  const result = { data: [1, 8, -2] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "min()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, -2);
});

test("test getDataFromSource array sum empty", async () => {
  const inputId = ":node1.data.sum()";
  const result = { data: [] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sum()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 0);
});

test("test getDataFromSource array max empty", async () => {
  const inputId = ":node1.data.max()";
  const result = { data: [] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "max()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 0);
});

test("test getDataFromSource array min empty", async () => {
  const inputId = ":node1.data.min()";
  const result = { data: [] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "min()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 0);
});

test("test getDataFromSource array average single element", async () => {
  const inputId = ":node1.data.average()";
  const result = { data: [42] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "average()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 42);
});

test("test getDataFromSource array sum single element", async () => {
  const inputId = ":node1.data.sum()";
  const result = { data: [42] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sum()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 42);
});

test("test getDataFromSource array max single element", async () => {
  const inputId = ":node1.data.max()";
  const result = { data: [42] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "max()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 42);
});

test("test getDataFromSource array min single element", async () => {
  const inputId = ":node1.data.min()";
  const result = { data: [42] };
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "min()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 42);
});

test("test getDataFromSource array average with negative and float", async () => {
  const inputId = ":node1.data.average()";
  const result = { data: [1.5, -0.5, 2.0] }; // sum: 3.0, len: 3
  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "average()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, 1.0);
});
