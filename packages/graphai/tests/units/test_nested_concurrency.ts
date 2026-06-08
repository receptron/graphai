import { GraphAI } from "../../src/index";
import * as agents from "../test_agents";
import { graphDataLatestVersion } from "../common";

import test from "node:test";
import assert from "node:assert";

// Regression for the "mapAgent: Concurrency is too low" failure caused by
// prepareForNesting draining its reserved slot into queued siblings.
//
// Structure mirrors a real-world graph (e.g. mulmocast translate): a mapAgent
// whose nested graph itself contains another mapAgent. With concurrency: 1 and
// multiple rows, sibling map children are queued at the moment an inner mapAgent
// prepares for nesting. The buggy drain loop handed the reserved headroom to a
// sibling, so the inner mapAgent saw running == concurrency and threw.
test("nested mapAgent within mapAgent does not trip the concurrency guard", async () => {
  const innermost = {
    version: graphDataLatestVersion,
    nodes: {
      row: {},
      out: { isResult: true, agent: "copyAgent", params: { namedKey: "row" }, inputs: { row: ":row" } },
    },
  };

  const innerGraph = {
    version: graphDataLatestVersion,
    nodes: {
      row: {},
      inner: {
        agent: "mapAgent",
        inputs: { rows: ":row" },
        params: { compositeResult: true },
        graph: innermost,
      },
      result: { isResult: true, agent: "copyAgent", params: { namedKey: "out" }, inputs: { out: ":inner.out" } },
    },
  };

  const graph_data = {
    version: graphDataLatestVersion,
    concurrency: 1,
    nodes: {
      data: { value: [[1, 2], [3, 4], [5, 6]] },
      outerMap: {
        agent: "mapAgent",
        inputs: { rows: ":data" },
        params: { compositeResult: true },
        graph: innerGraph,
      },
      result: { isResult: true, agent: "copyAgent", params: { namedKey: "result" }, inputs: { result: ":outerMap.result" } },
    },
  };

  const graphai = new GraphAI(graph_data, agents);
  const result = await graphai.run<{ result: unknown[] }>();
  assert.deepStrictEqual(result.result, [
    [1, 2],
    [3, 4],
    [5, 6],
  ]);
});
