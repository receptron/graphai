import { graphDataTestRunner } from "@receptron/test_utils";
import * as vanilla_agents from "@/index";
import { sleeperAgent } from "@graphai/sleeper_agents";
const agents = {
  sleeperAgent,
  ...vanilla_agents,
};

import { graphDataMap1, graphDataMap3, graphDataMap4, graphDataMap5 } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test map 1", async () => {
  const result = await graphDataTestRunner(__dirname, "test_map1", graphDataMap1, agents);
  assert.deepStrictEqual(result.result, [
    "I love apple.",
    "I love orange.",
    "I love banana.",
    "I love lemon.",
    "I love melon.",
    "I love pineapple.",
    "I love tomato.",
  ]);
});

// nest graph and flat
test("test map 3", async () => {
  const result = await graphDataTestRunner(__dirname, "test_map3", graphDataMap3, agents);
  assert.deepStrictEqual(result.result, [["hello", "hello2"]]);
});

test("test map 4", async () => {
  const result = await graphDataTestRunner(__dirname, "test_map4", graphDataMap4, agents);

  assert.deepStrictEqual(result.result, ["hello", "hello2"]);
});

test("test map 5", async () => {
  const result = await graphDataTestRunner(__dirname, "test_map5", graphDataMap5, agents);

  assert.deepStrictEqual(result.result, ["hello", "hello2"]);
});
