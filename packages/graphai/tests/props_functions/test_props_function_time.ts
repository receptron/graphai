import { parseNodeName } from "@/utils/utils";
import { propFunctions } from "@/utils/prop_function";
import { getDataFromSource } from "@/utils/data_source";
import { resultsOf } from "@/utils/result";

import test from "node:test";
import assert from "node:assert";

// $now function
test("test $now timestamp ms", async () => {
  const ret = resultsOf({ time: "${now}" }, {}, []);
  const timestamp_ms = ret.time as number;

  assert.ok(typeof timestamp_ms === "string");
  assert.ok(Number(timestamp_ms) > 1_000_000_000_000);
  assert.ok(Number(timestamp_ms) < 2_000_000_000_000);
});

// $now_ms function
test("test $now_ms timestamp ms", async () => {
  const ret = resultsOf({ time: "${now_ms}" }, {}, []);
  const timestamp_ms = ret.time as number;

  assert.ok(typeof timestamp_ms === "string");
  assert.ok(Number(timestamp_ms) > 1_000_000_000_000);
  assert.ok(Number(timestamp_ms) < 2_000_000_000_000);
});

// $now_s function
test("test $now_ms timestamp s", async () => {
  const ret = resultsOf({ time: "${now_s}" }, {}, []);
  const timestamp_s = ret.time as number;

  assert.ok(typeof timestamp_s === "string");
  assert.ok(Number(timestamp_s) > 1_000_000_000);
  assert.ok(Number(timestamp_s) < 2_000_000_000);
});
