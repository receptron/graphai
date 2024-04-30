import { AgentFunction } from "@/graphai";
import { rejectTest, fileTestRunner, graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";

import test from "node:test";
import assert from "node:assert";

const graphData = {
  nodes: {
    input: {
      agentId: "testAgent",
    },
    test: {
      agentId: "testAgent",
      inputs: ["input"],
    },
    test2: {
      agentId: "testAgent",
      inputs: ["test.hoge"],
    },
  },
};

const testAgent: AgentFunction<Record<never, never>, string> = async () => {
  return "test";
};

test("test source props test", async () => {
  await rejectTest(graphData, "result is not object.", { testAgent });
});

const graphData_literal = {
  nodes: {
    source: {
      value: "apple",
    },
    step1: {
      agentId: "stringTemplateAgent",
      params: {
        template: "${0}, ${1}"
      },
      inputs: ["source", '"orange"'],
      isResult: true,
    },
  },
};

test("test retry", async () => {
  const result = await graphDataTestRunner(__filename, graphData_literal, defaultTestAgents, () => {}, false);
  assert.deepStrictEqual(result, {
  });
});

