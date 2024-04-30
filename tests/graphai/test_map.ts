import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";

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

// nest graph and flat
const graphdata_map3 = {
  nodes: {
    source1: {
      value: ["hello", "hello2"],
    },
    nestedNode: {
      agentId: "mapAgent",
      inputs: ["source1"],
      graph: {
        nodes: {
          node1: {
            agentId: "bypassAgent",
            inputs: ["$0"],
            isResult: true,
          },
        },
      },
    },
    result: {
      agentId: "bypassAgent",
      inputs: ["nestedNode.node1"],
    },
  },
};

test("test map 3", async () => {
  const result = await graphDataTestRunner("test_map3", graphdata_map3, defaultTestAgents);
  assert.deepStrictEqual(result.result, [[["hello"], ["hello2"]]]);
});

const graphdata_map4 = {
  nodes: {
    source1: {
      value: ["hello", "hello2"],
    },
    nestedNode: {
      agentId: "mapAgent",
      inputs: ["source1"],
      graph: {
        nodes: {
          node1: {
            agentId: "bypassAgent",
            inputs: ["$0"],
            isResult: true,
          },
        },
      },
    },
    result: {
      agentId: "bypassAgent",
      params: {
        flat: 1,
      },
      inputs: ["nestedNode.node1"],
    },
  },
};

test("test map 4", async () => {
  const result = await graphDataTestRunner("test_map4", graphdata_map4, defaultTestAgents);

  assert.deepStrictEqual(result.result, [["hello"], ["hello2"]]);
});

const graphdata_map5 = {
  nodes: {
    source1: {
      value: ["hello", "hello2"],
    },
    nestedNode: {
      agentId: "mapAgent",
      inputs: ["source1"],
      graph: {
        nodes: {
          node1: {
            agentId: "bypassAgent",
            inputs: ["$0"],
            isResult: true,
          },
        },
      },
    },
    result: {
      agentId: "bypassAgent",
      params: {
        flat: 2,
      },
      inputs: ["nestedNode.node1"],
    },
  },
};

test("test map 5", async () => {
  const result = await graphDataTestRunner("test_map5", graphdata_map5, defaultTestAgents);

  assert.deepStrictEqual(result.result, ["hello", "hello2"]);
});
