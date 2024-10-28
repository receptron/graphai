import { parseNodeName } from "@/utils/utils";
import { propFunction } from "@/utils/prop_function";
import { getDataFromSource } from "@/utils/data_source";

import test from "node:test";
import assert from "node:assert";

// number function
test("test getDataFromSource number", async () => {
  const inputId = ":node1.data.toString()";
  const result = { data: 1 };
  const data = "1";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "toString()"] });

  const res = getDataFromSource(result, source, [propFunction]);
  assert.deepStrictEqual(res, data);
});
