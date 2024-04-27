import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "~/utils/agents";

import test from "node:test";
import assert from "node:assert";

const graphdata_push = {
  nodes: {
    source: {
      value: { fruits: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"] },
    },
    nestedNode: {
      agentId: "mapAgent",
      inputs: ["source.fruits"],
      graph: {
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
    },
    result: {
      agentId: "sleeperAgent",
      inputs: ["nestedNode.node2"],
    },
  },
};

test("test map 1", async () => {
  const result = await graphDataTestRunner("test_map", graphdata_push, defaultTestAgents);
  assert.deepStrictEqual(result.result, [
    { content: "I love apple." },
    { content: "I love orange." },
    { content: "I love banana." },
    { content: "I love lemon." },
    { content: "I love melon." },
    { content: "I love pineapple." },
    { content: "I love tomato." },
  ]);
});

const graphdata_map2 = {
  nodes: {
    source1: {
      value: { fruit: "apple" },
    },
    source2: {
      value: { fruit: "orange" },
    },
    source3: {
      value: { fruit: "banana" },
    },
    source4: {
      value: { fruit: "lemon" },
    },
    nestedNode: {
      agentId: "mapAgent",
      inputs: ["source1.fruit", "source2.fruit", "source3.fruit", "source4.fruit"],
      graph: {
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
    },
    result: {
      agentId: "sleeperAgent",
      inputs: ["nestedNode.node2"],
    },
  },
};

test("test map 2", async () => {
  const result = await graphDataTestRunner("test_map2", graphdata_map2, defaultTestAgents);
  assert.deepStrictEqual(result.result, [
    { content: "I love apple." },
    { content: "I love orange." },
    { content: "I love banana." },
    { content: "I love lemon." },
  ]);
});
