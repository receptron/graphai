import { parseNodeName } from "../../src/utils/utils";
import { propFunctions } from "../../src/utils/prop_function";
import { getDataFromSource } from "../../src/utils/data_source";

import test from "node:test";
import assert from "node:assert";

// number function
test("test getDataFromSource number", async () => {
  const inputId = ":node1.data.default(123)";
  const result = { data: undefined };
  const data = 123;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "default(123)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});
