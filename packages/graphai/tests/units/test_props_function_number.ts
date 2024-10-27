import { parseNodeName, getDataFromSource } from "@/utils/utils";

import test from "node:test";
import assert from "node:assert";

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
