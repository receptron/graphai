import { parseNodeName } from "@/utils/utils";
import { getDataFromSource } from "@/utils/data_source";

import test from "node:test";
import assert from "node:assert";

// boolean function
test("test getDataFromSource boolean not", async () => {
  const inputId = ":node1.data.not()";
  const result = { data: true };
  const data = false;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "not()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource boolean not", async () => {
  const inputId = ":node1.data.not()";
  const result = { data: false };
  const data = true;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "not()"] });

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});
