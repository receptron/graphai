import { graphDataTestRunner, fileTestRunner } from "@receptron/test_utils";
import * as vanilla_agents from "@/index";
import { sleeperAgent } from "@graphai/sleeper_agents";
const agents = {
  sleeperAgent,
  ...vanilla_agents,
};

import test from "node:test";
import assert from "node:assert";

const graphdata_map = {
  version: 0.5,
  nodes: {
    source: {
      value: {
        fruits: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
      },
    },
    nestedNode: {
      agent: "mapAgent",
      inputs: {
        rows: ":source.fruits",
      },
      graph: {
        version: 0.5,
        nodes: {
          node2: {
            agent: "stringTemplateAgent",
            params: {
              template: "I love ${0}.",
            },
            inputs: [":row"],
            isResult: true,
          },
        },
      },
    },
    result: {
      agent: "sleeperAgent",
      inputs: [":nestedNode.node2"],
      isResult: true,
    },
  },
};

const graphdata_map3 = {
  version: 0.5,
  nodes: {
    source1: {
      value: ["hello", "hello2"],
    },
    nestedNode: {
      agent: "mapAgent",
      inputs: {
        rows: ":source1",
      },
      graph: {
        version: 0.5,
        nodes: {
          node1: {
            agent: "bypassAgent",
            inputs: [":row"],
            isResult: true,
          },
        },
      },
    },
    result: {
      agent: "bypassAgent",
      inputs: [":nestedNode.node1"],
      isResult: true,
    },
  },
};

test("test map 1", async () => {
  const result = await graphDataTestRunner(__dirname, "test_map1", graphdata_map, agents);
  assert.deepStrictEqual(result.result, [
    "I love apple.",
    "I love orange.",
    "I love banana.",
    "I love lemon.",
    "I love melon.",
    "I love pineapple.",
    "I love tomato.",
  ]);
});

// nest graph and flat
test("test map 3", async () => {
  const result = await graphDataTestRunner(__dirname, "test_map3", graphdata_map3, agents);
  assert.deepStrictEqual(result.result, [[["hello"], ["hello2"]]]);
});

const graphdata_map4 = {
  version: 0.5,
  nodes: {
    source1: {
      value: ["hello", "hello2"],
    },
    nestedNode: {
      agent: "mapAgent",
      inputs: {
        rows: ":source1",
      },
      graph: {
        version: 0.5,
        nodes: {
          node1: {
            agent: "bypassAgent",
            inputs: [":row"],
            isResult: true,
          },
        },
      },
    },
    result: {
      agent: "bypassAgent",
      params: {
        flat: 1,
      },
      inputs: [":nestedNode.node1"],
    },
  },
};

test("test map 4", async () => {
  const result = await graphDataTestRunner(__dirname, "test_map4", graphdata_map4, agents);

  assert.deepStrictEqual(result.result, [["hello"], ["hello2"]]);
});

const graphdata_map5 = {
  version: 0.5,
  nodes: {
    source1: {
      value: ["hello", "hello2"],
    },
    nestedNode: {
      agent: "mapAgent",
      inputs: {
        rows: ":source1",
      },
      graph: {
        version: 0.5,
        nodes: {
          node1: {
            agent: "bypassAgent",
            inputs: [":row"],
            isResult: true,
          },
        },
      },
    },
    result: {
      agent: "bypassAgent",
      params: {
        flat: 2,
      },
      inputs: [":nestedNode.node1"],
    },
  },
};

test("test map 5", async () => {
  const result = await graphDataTestRunner(__dirname, "test_map5", graphdata_map5, agents);

  assert.deepStrictEqual(result.result, ["hello", "hello2"]);
});
