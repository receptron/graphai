import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@/index";
import { sleeperAgent } from "@graphai/sleeper_agents";

import { graphdata, graphdata2, graphdata3 } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test dynamic graph", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphdata, { ...agents, sleeperAgent }, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      reducer: ["hello", "hello", "hello", "hello", "hello"],
    },
  });
});

test("test dynamic graph parser", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphdata2, { ...agents, sleeperAgent }, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      reducer: ["hello", "hello", "hello", "hello", "hello"],
    },
  });
});

test("test dynamic graph parser extra", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphdata3, { ...agents, sleeperAgent }, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      reducer: ["hello", "hello", "hello", "hello", "hello"],
    },
  });
});
