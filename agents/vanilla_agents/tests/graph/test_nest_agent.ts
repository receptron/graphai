import { graphDataTestRunner } from "@graphai/test_utils";
import * as agents from "@graphai/agents";

import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: 0.3,
  nodes: {
    source: {
      value: "Hello World",
    },
    nestedNode: {
      agent: "nestedAgent",
      inputs: { inner0: ":source" },
      isResult: true,
      graph: {
        nodes: {
          result: {
            agent: "copyAgent",
            inputs: [":inner0"],
            isResult: true,
          },
        },
      },
    },
  },
};

test("test nested agent", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    nestedNode: {
      result: "Hello World",
    },
  });
});

const graph_data2 = {
  version: 0.3,
  nodes: {
    source: {
      value: "Hello World",
    },
    nestedNode: {
      agent: "nestedAgent",
      inputs: { source: ":source" },
      isResult: true,
      graph: {
        nodes: {
          result: {
            agent: "copyAgent",
            inputs: [":source"],
            isResult: true,
          },
        },
      },
    },
  },
};

test("test nested agent 2", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graph_data2, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    nestedNode: {
      result: "Hello World",
    },
  });
});
