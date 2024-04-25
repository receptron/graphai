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
          },
        },
      },
    },
    result: {
      agentId: "sleeperAgent",
      inputs: ["nestedNode.contents"]
    }
  },
};

test("test map", async () => {
  const result = await graphDataTestRunner(__filename, graphdata_push, { stringTemplateAgent, sleeperAgent, mapAgent });
  assert.deepStrictEqual(result.result, [
    { content: 'I love apple.' },
    { content: 'I love orange.' },
    { content: 'I love banana.' },
    { content: 'I love lemon.' },
    { content: 'I love melon.' },
    { content: 'I love pineapple.' },
    { content: 'I love tomato.' },
  ]);
});

