import { AgentFunction } from "@/index";
import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { agentInfoWrapper } from "@/utils/utils";

import test from "node:test";
import assert from "node:assert";

const graphData = {
  version: 0.3,
  nodes: {
    input: {
      agent: "testAgent",
    },
    test: {
      agent: "testAgent",
      inputs: [":input"],
    },
    test2: {
      agent: "testAgent",
      inputs: [":test.hoge"],
      isResult: true,
    },
  },
};

const testAgent: AgentFunction<Record<never, never>, string> = async () => {
  return "test";
};

test("test source props test", async () => {
  const result = await graphDataTestRunner(__filename, graphData, { testAgent: agentInfoWrapper(testAgent) }, () => {}, false);
  console.log(result);
  assert.deepStrictEqual(result, {
    test2: "test"
  });
  // await rejectTest(graphData, "result is not object.", { testAgent: agentInfoWrapper(testAgent) }, false);
});

const graphData_literal = {
  version: 0.3,
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
      },
      inputs: [":source", "orange", undefined],
      isResult: true,
    },
    step2: {
      agent: "sleeperAgent",
      inputs: [":source2", { lemon: "yellow" }],
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
