import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { GraphAI } from "@/graphai";

import test from "node:test";
import assert from "node:assert";

const graphdata_any = {
  nodes: {
    source: {
      value: {},
    },
    positive: {
      agentId: "sleeperAgent",
      anyInput: true,
      isResult: true,
      inputs: ["source.yes"],
    },
    negative: {
      agentId: "sleeperAgent",
      anyInput: true,
      isResult: true,
      inputs: ["source.no"],
    },
  },
};

test("test any 1", async () => {
  const result = await graphDataTestRunner(__filename, graphdata_any, defaultTestAgents, () => {}, false);
  assert.deepStrictEqual(result, {});
});

test("test any yes", async () => {
  const result = await graphDataTestRunner(
    __filename,
    graphdata_any,
    defaultTestAgents,
    (graph: GraphAI) => {
      graph.injectValue("source", { yes: { apple: "red" } });
    },
    false,
  );
  assert.deepStrictEqual(result, {
    positive: { apple: "red" },
  });
});

test("test any no", async () => {
  const result = await graphDataTestRunner(
    __filename,
    graphdata_any,
    defaultTestAgents,
    (graph: GraphAI) => {
      graph.injectValue("source", { no: { lemon: "yellow" } });
    },
    false,
  );
  assert.deepStrictEqual(result, {
    negative: { lemon: "yellow" },
  });
});
