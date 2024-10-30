import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@/index";
import { sleepAndMergeAgent } from "@graphai/sleeper_agents";

import { dynamicGraphData, dynamicGraphData2, dynamicGraphData3 } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test dynamic graph", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, dynamicGraphData, { ...agents, sleepAndMergeAgent }, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      reducer: {array: ["hello", "hello", "hello", "hello", "hello"]},
    },
  });
});

test("test dynamic graph parser", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, dynamicGraphData2, { ...agents, sleepAndMergeAgent }, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      reducer: {array: ["hello", "hello", "hello", "hello", "hello"]},
    },
  });
});

test("test dynamic graph parser extra", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, dynamicGraphData3, { ...agents, sleepAndMergeAgent }, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      reducer: {array: ["hello", "hello", "hello", "hello", "hello"]},
    },
  });
});
