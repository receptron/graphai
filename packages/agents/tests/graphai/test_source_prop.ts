import { AgentFunction } from "graphai";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@/index";
import { agentInfoWrapper } from "graphai";

import { graphDataLiteral } from "./graphData";

import test from "node:test";
import assert from "node:assert";

const graphDataSourceProps = {
  version: 0.5,
  nodes: {
    input: {
      agent: "testAgent",
    },
    test: {
      agent: "testAgent",
      inputs: { item: ":input" },
    },
    test2: {
      agent: "testAgent",
      inputs: { item: ":test.hoge" },
      isResult: true,
    },
  },
};

const testAgent: AgentFunction<Record<never, never>, string> = async () => {
  return "test";
};

test("test source props test", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataSourceProps, { testAgent: agentInfoWrapper(testAgent) }, () => {}, false);
  assert.deepStrictEqual(result, {
    test2: "test",
  });
});

test("test retry", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataLiteral, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    step1: "apple, orange, undefined.",
    step2: { apple: "red", lemon: "yellow" },
  });
});
