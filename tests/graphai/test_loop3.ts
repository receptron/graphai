import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { fileBaseName } from "~/utils/file_utils";

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
      inputs: [":source"],
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
              value: ":$0",
            },
          },
          reducer: {
            agent: "pushAgent",
            inputs: [":array", ":item"],
            isResult: true,
          },
        },
      },
    },
  },
};

test("test nested loop & $0", async () => {
  const result = await graphDataTestRunner(__filename, graphdata_nested, defaultTestAgents, () => {}, false);
  assert.deepStrictEqual(result, {
    parent: {
      reducer: [
        "hello", "hello",
        "hello", "hello",
        "hello", "hello",
        "hello", "hello",
        "hello", "hello"
      ]
    }
  });
});