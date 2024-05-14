import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";

import { defaultTestAgents } from "@/utils/test_agents";
import { getAgentInfo } from "@/utils/test_utils";

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
  const result = await graphDataTestRunner(__filename, graphData_literal, { testAgent: getAgentInfo(testAgent), ...defaultTestAgents }, () => {}, false);
  assert.deepStrictEqual(result, {
    test1: { fruit: { apple: "red" }, color: "yellow" },
    test2: { fruit: { apple: "red" }, color: "yellow" },
  });
});
