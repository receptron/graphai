import { graphDataTestRunner, fileBaseName } from "@receptron/test_utils";
import * as vanilla_agents from "@/index";
import { sleepAndMergeAgent } from "@graphai/sleeper_agents";
const agents = {
  sleepAndMergeAgent,
  ...vanilla_agents,
};

import { graphDataNested, graphDataNestedPop, graphDataNestedInjection } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test nested loop & $0", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataNested, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    parent: {
      reducer: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
    },
  });
});

test("test loop, update $0", async () => {
  const result = await graphDataTestRunner(__dirname, fileBaseName(__filename) + "_2.log", graphDataNestedPop, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    parent: {
      result: ["lemon", "banana", "orange"],
    },
  });
});

test("test nested loop & injection", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataNestedInjection, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    parent: {
      reducer: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
    },
  });
});
