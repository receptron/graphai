import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { fileBaseName } from "~/utils/file_utils";

import test from "node:test";
import assert from "node:assert";

const graphdata_child = {
  version: 0.3,
  loop: {
    count: 5,
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

const graphdata = {
  version: 0.3,
  nodes: {
    nested: {
      agent: "nestedAgent",
      graph: graphdata_child,
      isResult: true
    }
  }
}

test("test dynamic graph", async () => {
  const result = await graphDataTestRunner(__filename, graphdata, defaultTestAgents, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      reducer: ["hello", "hello", "hello", "hello", "hello"],
    }
  });
});

