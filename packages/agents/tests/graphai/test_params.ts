import { AgentFunction } from "graphai";
import { graphDataTestRunner } from "@graphai/test_utils";

import * as agents from "@/index";
import { agentInfoWrapper } from "graphai/lib/utils/utils";

import test from "node:test";
import assert from "node:assert";

const testAgent: AgentFunction<Record<never, never>, any> = async ({ params }) => {
  return params;
};

const graphData_literal = {
  version: 0.3,
  nodes: {
    source1: {
      value: { apple: "red" },
    },
    source2: {
      value: { lemon: "yellow" },
    },
    delayed1: {
      agent: "sleeperAgent",
      inputs: [":source1"],
    },
    delayed2: {
      agent: "sleeperAgent",
      params: {
        duration: 100,
      },
      inputs: [":source2"],
    },
    test1: {
      agent: "testAgent",
      params: {
        fruit: ":source1",
        color: ":source2.lemon",
      },
      isResult: true,
    },
    test2: {
      agent: "testAgent",
      params: {
        fruit: ":delayed1",
        color: ":delayed2.lemon",
      },
      isResult: true,
    },
  },
};

test("test params", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphData_literal, { testAgent: agentInfoWrapper(testAgent), ...agents }, () => {}, false);
  assert.deepStrictEqual(result, {
    test1: { fruit: { apple: "red" }, color: "yellow" },
    test2: { fruit: { apple: "red" }, color: "yellow" },
  });
});
