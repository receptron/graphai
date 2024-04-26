import { graphDataTestRunner } from "~/utils/runner";
import { sleeperAgent, mapAgent, stringTemplateAgent } from "@/experimental_agents";
// import { fileBaseName } from "~/utils/file_utils";

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
      params: {
        injectionTo: "node1",
        resultFrom: "node2",
      },
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
            inputs: ["node1"],
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

test("test map", async () => {
  const result = await graphDataTestRunner("test_map", graphdata_push, { stringTemplateAgent, sleeperAgent, mapAgent });
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
      params: {
        injectionTo: "node1",
        resultFrom: "node2",
      },
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
            inputs: ["node1"],
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

test("test map", async () => {
  const result = await graphDataTestRunner("test_map2", graphdata_map2, { stringTemplateAgent, sleeperAgent, mapAgent });
  assert.deepStrictEqual(result.result, [
    { content: "I love apple." },
    { content: "I love orange." },
    { content: "I love banana." },
    { content: "I love lemon." },
  ]);
});
