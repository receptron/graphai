import { graphDataTestRunner, fileBaseName } from "@receptron/test_utils";
import * as vanilla_agents from "@/index";
import { sleepAndMergeAgent } from "@graphai/sleeper_agents";
const agents = {
  sleepAndMergeAgent,
  ...vanilla_agents,
};

import { graphDataPush, graphDataPop } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test loop & push", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataPush, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    // array: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
    // item: "hello",
    reducer: { array: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"] },
  });
});

test("test loop & pop", async () => {
  const result = await graphDataTestRunner(__dirname, fileBaseName(__filename) + "_2.log", graphDataPop, agents);
  assert.deepStrictEqual(result.result, ["lemon", "banana", "orange"]);
});
