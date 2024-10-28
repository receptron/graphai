import { parseNodeName } from "@/utils/utils";
import { getDataFromSource } from "@/utils/data_source";

import test from "node:test";
import assert from "node:assert";

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

test("test getDataFromSource string codeBlack", async () => {
  const inputId = ":node1.text.codeBlock()";
  const result = { text: '```\nimport * as a from "aa";\n\nconsole.log("hello");\n```\n\n' };
  const data = '\nimport * as a from "aa";\n\nconsole.log("hello");';

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["text", "codeBlock()"] });

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
