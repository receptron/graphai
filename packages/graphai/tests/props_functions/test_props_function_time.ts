import { parseNodeName } from "@/utils/utils";
import { propFunctions } from "@/utils/prop_function";
import { getDataFromSource } from "@/utils/data_source";
import { resultsOf } from "@/utils/result";

import test from "node:test";
import assert from "node:assert";

// boolean function
test("test getDataFromSource boolean not", async () => {
  const ret = resultsOf({ time: "$now" }, {}, []);
  console.log(ret);

  assert.strictEqual(Number.isInteger(ret.time), true);
});
