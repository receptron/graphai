import { parseNodeName, getDataFromSource } from "@/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test getDataFromSource", async () => {
  const inputId = "node1";
  const result = { data: "123" };
  const data = { data: "123" };

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source.propIds);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource parseId", async () => {
  const inputId = "node1.data";
  const result = { data: "123" };
  const data = "123";

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source.propIds);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array", async () => {
  const inputId = "node1";
  const result = ["123"];
  const data = ["123"];

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source.propIds);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array $0", async () => {
  const inputId = "node1.$0";
  const result = ["000", "111"];
  const data = "000";

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source.propIds);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array $1", async () => {
  const inputId = "node1.$1";
  const result = ["000", "111"];
  const data = "111";

  const source = parseNodeName(inputId);
  const res = getDataFromSource(result, source.propIds);
  assert.deepStrictEqual(res, data);
});
