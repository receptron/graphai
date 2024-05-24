import { graphDataTestRunner, fileTestRunner } from "@graphai/test_utils";
import * as agents from "@graphai/vanilla";

import test from "node:test";
import assert from "node:assert";

test("test map 1", async () => {
  const result = await fileTestRunner(__dirname, "/graphs/map/map1.yaml", agents);
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

test("test map 2", async () => {
  const result = await fileTestRunner(__dirname, "/graphs/map/map2.yaml", agents);
  assert.deepStrictEqual(result.result, ["I love apple.", "I love orange.", "I love banana.", "I love lemon."]);
});

// nest graph and flat
test("test map 3", async () => {
  const result = await fileTestRunner(__dirname, "/graphs/map/map3.yaml", agents);
  assert.deepStrictEqual(result.result, [[["hello"], ["hello2"]]]);
});

const graphdata_map4 = {
  version: 0.3,
  nodes: {
    source1: {
      value: ["hello", "hello2"],
    },
    nestedNode: {
      agent: "mapAgent",
      inputs: [":source1"],
      graph: {
        version: 0.3,
        nodes: {
          node1: {
            agent: "bypassAgent",
            inputs: [":$0"],
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
  version: 0.3,
  nodes: {
    source1: {
      value: ["hello", "hello2"],
    },
    nestedNode: {
      agent: "mapAgent",
      inputs: [":source1"],
      graph: {
        version: 0.3,
        nodes: {
          node1: {
            agent: "bypassAgent",
            inputs: [":$0"],
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
