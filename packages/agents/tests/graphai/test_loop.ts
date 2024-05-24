import { graphDataTestRunner, fileBaseName } from "@graphai/test_utils";
import * as agents from "@/index";

import test from "node:test";
import assert from "node:assert";

const graphdata_push = {
  version: 0.3,
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
      inputs: [":array", ":item"],
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
  version: 0.3,
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
      inputs: [":source"],
      agent: "popAgent", // returns { array, item }
    },
    reducer: {
      agent: "pushAgent",
      inputs: [":result", ":popper.item"],
    },
  },
};

test("test loop & pop", async () => {
  const result = await graphDataTestRunner(__dirname, fileBaseName(__filename) + "_2.log", graphdata_pop, agents);
  assert.deepStrictEqual(result.result, ["lemon", "banana", "orange"]);
});
