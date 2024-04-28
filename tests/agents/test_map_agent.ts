import { mapAgent, stringTemplateAgent } from "@/experimental_agents";
import { defaultTestContext } from "@/utils/test_utils";

import test from "node:test";
import assert from "node:assert";

test("test map_agent", async () => {
  const result = await mapAgent({
    ...defaultTestContext,
    agents: { mapAgent, stringTemplateAgent },
    graphData: {
      nodes: {
        node2: {
          agentId: "stringTemplateAgent",
          params: {
            template: "I love ${0}.",
          },
          inputs: ["$0.fruit"],
          isResult: true,
        },
      },
    },
    inputs: [[{ fruit: "apple" }, { fruit: "orange" }]],
  });
  assert.deepStrictEqual(result, {
    node2: [{ content: "I love apple." }, { content: "I love orange." }],
  });
});

test("test map_agent 2", async () => {
  const result = await mapAgent({
    ...defaultTestContext,
    agents: { mapAgent, stringTemplateAgent },
    graphData: {
      nodes: {
        node2: {
          agentId: "stringTemplateAgent",
          params: {
            template: "I love ${0}.",
          },
          inputs: ["$0"],
          isResult: true,
        },
      },
    },
    inputs: [["apple", "orange", "banana", "lemon"]],
  });
  assert.deepStrictEqual(result, {
    node2: [{ content: "I love apple." }, { content: "I love orange." }, { content: "I love banana." }, { content: "I love lemon." }],
  });
});

test("test map_agent 3", async () => {
  const result = await mapAgent({
    ...defaultTestContext,
    agents: { mapAgent, stringTemplateAgent },
    graphData: {
      nodes: {
        node2: {
          agentId: "stringTemplateAgent",
          params: {
            template: "${1} ${2} ${0}.",
          },
          inputs: ["$0", "$1", "$2"],
          isResult: true,
        },
      },
    },
    inputs: [["apple", "orange", "banana", "lemon"], "You", "like"],
  });
  assert.deepStrictEqual(result, {
    node2: [{ content: "You like apple." }, { content: "You like orange." }, { content: "You like banana." }, { content: "You like lemon." }],
  });
});
