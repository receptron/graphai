import { GraphAI } from "graphai";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

import { nestedGraphData, nestedGraphData2 } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test nested agent", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, nestedGraphData, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    nestedNode: {
      resultInner: {
        text: "Hello World",
      },
    },
  });
});

test("test nested agent 2", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, nestedGraphData2, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    nestedNode: {
      result: {
        text: "Hello World",
      },
    },
  });
});

test("test nested agent 3", async () => {
  const logIds: string[] = [];
  const graph = new GraphAI(nestedGraphData, agents);
  graph.onLogCallback = (log, __flag) => {
    logIds.push(log.nodeId);
  };
  await graph.run();
  // console.log(logIds);

  assert.deepStrictEqual(logIds, ["nestedNode", "nestedNode", "resultInner", "resultInner", "resultInner", "nestedNode"]);
});
