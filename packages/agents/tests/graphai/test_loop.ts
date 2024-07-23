import { graphDataTestRunner, fileBaseName } from "@receptron/test_utils";
import * as agents from "@/index";

import test from "node:test";
import assert from "node:assert";

const graphdata_push = {
  version: 0.5,
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
        value: "hello",
      },
    },
    reducer: {
      isResult: true,
      agent: "pushAgent",
      inputs: { array: ":array", item: ":item" },
    },
  },
};

test("test loop & push", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphdata_push, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    // array: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
    // item: "hello",
    reducer: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
  });
});

const graphdata_pop = {
  version: 0.5,
  loop: {
    while: ":source",
  },
  nodes: {
    source: {
      value: ["orange", "banana", "lemon"],
      update: ":popper.array",
    },
    result: {
      value: [],
      update: ":reducer",
    },
    popper: {
      inputs: { array: ":source" },
      agent: "popAgent", // returns { array, item }
    },
    reducer: {
      agent: "pushAgent",
      inputs: { array: ":result", item: ":popper.item" },
    },
  },
};

test("test loop & pop", async () => {
  const result = await graphDataTestRunner(__dirname, fileBaseName(__filename) + "_2.log", graphdata_pop, agents);
  assert.deepStrictEqual(result.result, ["lemon", "banana", "orange"]);
});
