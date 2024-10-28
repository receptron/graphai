import { parseNodeName } from "@/utils/utils";
import { propFunction } from "@/utils/prop_function";
import { getDataFromSource } from "@/utils/data_source";

import test from "node:test";
import assert from "node:assert";

test("test getDataFromSource", async () => {
  const inputId = ":node1";
  const result = { data: "123" };
  const data = { data: "123" };

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1" });
  const res = getDataFromSource(result, source, propFunction);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource invalid props", async () => {
  const inputId = ":node1.abc.def.sort()";
  const result = { data: "123" };
  const data = undefined;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["abc", "def", "sort()"] });
  const res = getDataFromSource(result, source, propFunction);

  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource parseId", async () => {
  const inputId = ":node1.data";
  const result = { data: "123" };
  const data = "123";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data"] });
  const res = getDataFromSource(result, source, propFunction);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array", async () => {
  const inputId = ":node1";
  const result = ["123"];
  const data = ["123"];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1" });
  const res = getDataFromSource(result, source, propFunction);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array $0", async () => {
  const inputId = ":node1.$0";
  const result = ["000", "111"];
  const data = "000";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["$0"] });
  const res = getDataFromSource(result, source, propFunction);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource array $1", async () => {
  const inputId = ":node1.$1";
  const result = ["000", "111"];
  const data = "111";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["$1"] });
  const res = getDataFromSource(result, source, propFunction);
  assert.deepStrictEqual(res, data);
});

// nested propId

test("test getDataFromSource nested object", async () => {
  const inputId = ":node1.data.sample";
  const result = { data: { sample: "123" } };
  const data = "123";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample"] });
  const res = getDataFromSource(result, source, propFunction);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource nested array", async () => {
  const inputId = ":node1.data.sample.$2";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = 2;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "$2"] });
  const res = getDataFromSource(result, source, propFunction);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource nested array last", async () => {
  const inputId = ":node1.data.sample.$last";
  const result = { data: { sample: [0, 1, 2, 3] } };
  const data = 3;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "$last"] });

  const res = getDataFromSource(result, source, propFunction);
  assert.deepStrictEqual(res, data);
});
