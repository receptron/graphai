import { mapAgent, stringTemplateAgent } from "@/experimental_agents";
import { defaultTestContext } from "~/agents/utils";

import test from "node:test";
import assert from "node:assert";

test("test map_agent", async () => {
  const result = await mapAgent({
    ...defaultTestContext,
    agents: { mapAgent, stringTemplateAgent },
    graph: {
      nodes: {
        node1: {
          value: { fruit: "none" },
        },
        node2: {
          agentId: "stringTemplateAgent",
          params: {
            template: "I love ${0}.",
          },
          inputs: ["node1.fruit"],
        },
      },
    },
    params: {
      injectionTo: "node1",
      resultFrom: "node2",
    },
    inputs: [[{ fruit: "apple" }, { fruit: "orange" }]],
  });
  assert.deepStrictEqual(result, {
    contents: [{ content: "I love apple." }, { content: "I love orange." }],
  });
});

test("test map_agent 2", async () => {
  const result = await mapAgent({
    ...defaultTestContext,
    agents: { mapAgent, stringTemplateAgent },
    graph: {
      nodes: {
        node1: {
          value: {},
        },
        node2: {
          agentId: "stringTemplateAgent",
          params: {
            template: "I love ${0}.",
          },
          inputs: ["node1"],
        },
      },
    },
    params: {
      injectionTo: "node1",
      resultFrom: "node2",
    },
    inputs: [["apple", "orange", "banana", "lemon"]],
  });
  assert.deepStrictEqual(result, {
    contents: [{ content: "I love apple." }, { content: "I love orange." }, { content: "I love banana." }, { content: "I love lemon." }],
  });
});
