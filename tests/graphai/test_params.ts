import { AgentFunction } from "@/graphai";
import { rejectTest, graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";

import test from "node:test";
import assert from "node:assert";


const testAgent: AgentFunction<Record<never, never>, string> = async () => {
  return "test";
};


const graphData_literal = {
  version: 0.2,
  nodes: {
    source: {
      value: "apple",
    },
    source2: {
      value: { apple: "red" },
    },
    step1: {
      agent: "stringTemplateAgent",
      params: {
        template: "${0}, ${1}, ${2}.",
        foo: "${source2}",
        bar: "${source2.bar}",
      },
      inputs: ["source", "\"orange\"", undefined],
      isResult: true,
    },
    step2: {
      agent: "sleeperAgent",
      inputs: ["source2", { lemon: "yellow" }],
      isResult: true,
    },
  },
};

test("test retry", async () => {
  const result = await graphDataTestRunner(__filename, graphData_literal, defaultTestAgents, () => {}, false);
  assert.deepStrictEqual(result, {
    step1: "apple, orange, undefined.",
    step2: { apple: "red", lemon: "yellow" },
  });
});
