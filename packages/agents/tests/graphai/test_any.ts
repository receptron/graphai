import { GraphAI } from "graphai";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@/index";

import { graphDataAny, graphDataAny2 } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test any 1", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataAny, agents, () => {}, false);
  assert.deepStrictEqual(result, {});
});

test("test any yes", async () => {
  const result = await graphDataTestRunner(
    __dirname,
    __filename,
    graphDataAny,
    agents,
    (graph: GraphAI) => {
      graph.injectValue("source", { yes: { apple: "red" } });
    },
    false,
  );
  assert.deepStrictEqual(result, {
    positive: { apple: "red" },
  });
});

test("test any no", async () => {
  const result = await graphDataTestRunner(
    __dirname,
    __filename,
    graphDataAny,
    agents,
    (graph: GraphAI) => {
      graph.injectValue("source", { no: { lemon: "yellow" } });
    },
    false,
  );
  assert.deepStrictEqual(result, {
    negative: { lemon: "yellow" },
  });
});

test("test any", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataAny2, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    router1: { apple: "red" },
    router2: { lemon: "yellow" },
    receiver: { apple: "red" },
  });
});
