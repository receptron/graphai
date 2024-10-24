import { parseNodeName, getDataFromSource } from "@/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test getDataFromSource", async () => {
  const inputId = ":node1";
  const result = { data: "123" };
  const data = { data: "123" };

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1" });
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource invalid props", async () => {
  const inputId = ":node1.abc.def.sort()";
  const result = { data: "123" };
  const data = undefined;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["abc", "def", "sort()"] });
  const res = getDataFromSource(result, source);

  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource parseId", async () => {
  const inputId = ":node1.data";
  const result = { data: "123" };
  const data = "123";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data"] });
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array", async () => {
  const inputId = ":node1";
  const result = ["123"];
  const data = ["123"];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1" });
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array $0", async () => {
  const inputId = ":node1.$0";
  const result = ["000", "111"];
  const data = "000";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["$0"] });
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array $1", async () => {
  const inputId = ":node1.$1";
  const result = ["000", "111"];
  const data = "111";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["$1"] });
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

// nested propId

test("test getDataFromSource nested object", async () => {
  const inputId = ":node1.data.sample";
  const result = { data: { sample: "123" } };
  const data = "123";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample"] });
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource nested array", async () => {
  const inputId = ":node1.data.sample.$2";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = 2;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "$2"] });
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource nested array last", async () => {
  const inputId = ":node1.data.sample.$last";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = 3;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "$last"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

// function for object
test("test getDataFromSource nested object keys", async () => {
  const inputId = ":node1.data.sample.keys()";
  const result = { data: { sample: { a: "123", b: "abc" } } };
  const data = ["a", "b"];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "keys()"] });
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource nested object values", async () => {
  const inputId = ":node1.data.sample.values()";
  const result = { data: { sample: { a: "123", b: "abc" } } };
  const data = ["123", "abc"];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "values()"] });
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource nested object values", async () => {
  // An example that is not good because the order is not unique
  const inputId = ":node1.data.sample.values().$last";
  const result = { data: { sample: { a: "123", b: "abc" } } };
  const data = "abc";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "values()", "$last"] });
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

// function for array
test("test getDataFromSource array length", async () => {
  const inputId = ":node1.data.sample.length()";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = 4;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "length()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array join", async () => {
  const inputId = ":node1.data.sample.join(-)";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = "0-1-2-3";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "join(-)"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array join ,", async () => {
  const inputId = ":node1.data.sample.join(,)";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = "0,1,2,3";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "join(,)"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array join ,", async () => {
  const inputId = ":node1.data.sample.join()";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = "0123";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "join()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array flat", async () => {
  const inputId = ":node1.data.sample.flat()";
  const result = { data: { sample: [0, [1, [2, [3]]]] } };
  const data = [0, 1, [2, [3]]];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "flat()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array flat", async () => {
  const inputId = ":node1.data.sample.flat().flat()";
  const result = { data: { sample: [0, [1, [2, [3]]]] } };
  const data = [0, 1, 2, [3]];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "flat()", "flat()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array to_json", async () => {
  const inputId = ":node1.data.toJSON()";
  const result = { data: { sample: [0, [1, [2, [3]]]] } };
  const data = '{"sample":[0,[1,[2,[3]]]]}';

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "toJSON()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

// text function
test("test getDataFromSource string json", async () => {
  const inputId = ":node1.data.jsonParse()";
  const result = { data: '{ "sample": [0, 1, 2, 3] }' };
  const data = { sample: [0, 1, 2, 3] };

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "jsonParse()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string number", async () => {
  const inputId = ":node1.data.toNumber()";
  const result = { data: "12" };
  const data = 12;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "toNumber()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string number", async () => {
  const inputId = ":node1.data.toNumber()";
  const result = { data: "aa" };
  const data = undefined;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "toNumber()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string number", async () => {
  const inputId = ":node1.data.jsonParse()";
  const result = { data: '{ "sample": [0, 1, 2, 3] }' };
  const data = { sample: [0, 1, 2, 3] };

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "jsonParse()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

// no default yaml parser on Node.js
/*
test("test getDataFromSource array flat", async () => {
  const inputId = ":node1.data.yamlParse()";
  const result = { data: "sample\n - 0\n  - 1\n  - 2\n  - 3" };
  const data = 4;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "yamlParse()"],});

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});
*/

test("test getDataFromSource nested object values", async () => {
  const inputId = ":node1.data.sample.values().join(-)";
  const result = { data: { sample: { a: "123", b: "abc" } } };
  const data = "123-abc";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "values()", "join(-)"] });
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

// number function
test("test getDataFromSource number", async () => {
  const inputId = ":node1.data.toString()";
  const result = { data: 1 };
  const data = "1";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "toString()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});
