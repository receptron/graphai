import { parseNodeName, getDataFromSource } from "@/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test getDataFromSource", async () => {
  const inputId = "node1";
  const result = { data: "123" };
  const data = { data: "123" };

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource parseId", async () => {
  const inputId = "node1.data";
  const result = { data: "123" };
  const data = "123";

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array", async () => {
  const inputId = "node1";
  const result = ["123"];
  const data = ["123"];

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array $0", async () => {
  const inputId = "node1.$0";
  const result = ["000", "111"];
  const data = "000";

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array $1", async () => {
  const inputId = "node1.$1";
  const result = ["000", "111"];
  const data = "111";

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

// nested propId

test("test getDataFromSource nested object", async () => {
  const inputId = "node1.data.sample";
  const result = { data: { sample: "123" } };
  const data = "123";

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource nested array", async () => {
  const inputId = "node1.data.sample.$2";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = 2;

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource nested array last", async () => {
  const inputId = "node1.data.sample.$last";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = 3;

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});
