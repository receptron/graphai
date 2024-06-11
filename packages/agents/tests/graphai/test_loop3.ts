import { graphDataTestRunner, fileBaseName } from "@receptron/test_utils";
import * as agents from "@/index";

import test from "node:test";
import assert from "node:assert";

const graphdata_nested = {
  version: 0.3,
  nodes: {
    source: {
      value: "hello",
    },
    parent: {
      agent: "nestedAgent",
      inputs: { source: ":source" },
      isResult: true,
      graph: {
        loop: {
          count: 10,
        },
        nodes: {
          array: {
            value: [],
            update: ":reducer",
          },
          item: {
            agent: "sleeperAgent",
            params: {
              duration: 10,
              value: ":source",
            },
          },
          reducer: {
            agent: "pushAgent",
            inputs: { array: ":array", item: ":item" },
            isResult: true,
          },
        },
      },
    },
  },
};

test("test nested loop & $0", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphdata_nested, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    parent: {
      reducer: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
    },
  });
});

const graphdata_pop = {
  version: 0.3,
  nodes: {
    fruits: {
      value: ["orange", "banana", "lemon"],
    },
    parent: {
      agent: "nestedAgent",
      isResult: true,
      inputs: { fruits: ":fruits" },
      graph: {
        loop: {
          while: ":fruits",
        },
        nodes: {
          fruits: {
            value: [], // it will be filled with inputs[0]
            update: ":popper.array",
          },
          result: {
            value: [],
            update: ":reducer",
            isResult: true,
          },
          popper: {
            inputs: { array: ":fruits" },
            agent: "popAgent", // returns { array, item }
          },
          reducer: {
            agent: "pushAgent",
            inputs: { array: ":result", item: ":popper.item" },
          },
        },
      },
    },
  },
};

test("test loop, update $0", async () => {
  const result = await graphDataTestRunner(__dirname, fileBaseName(__filename) + "_2.log", graphdata_pop, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    parent: {
      result: ["lemon", "banana", "orange"],
    },
  });
});

const graphdata_nested_injection = {
  version: 0.3,
  nodes: {
    source: {
      value: "hello",
    },
    parent: {
      agent: "nestedAgent",
      inputs: { inner_source: ":source" },
      isResult: true,
      graph: {
        loop: {
          count: 10,
        },
        nodes: {
          array: {
            value: [],
            update: ":reducer",
          },
          item: {
            agent: "sleeperAgent",
            params: {
              duration: 10,
              value: ":inner_source",
            },
          },
          reducer: {
            agent: "pushAgent",
            inputs: { array: ":array", item: ":item" },
            isResult: true,
          },
        },
      },
    },
  },
};

test("test nested loop & injection", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphdata_nested_injection, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    parent: {
      reducer: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
    },
  });
});
