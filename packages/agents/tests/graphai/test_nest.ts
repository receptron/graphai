import { GraphAI } from "graphai";
import { graphDataTestRunner } from "@receptron/test_utils";
import { nestedAgent, copyAgent, propertyFilterAgent, mapAgent } from "@/index";

import { validChildGraph, graphDataNested } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test nest valid", async () => {
  const result = await graphDataTestRunner(__dirname, "test_nest_valid", graphDataNested, { nestedAgent, copyAgent, propertyFilterAgent }, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      result: {
        source: 1,
      },
    },
  });
});

const invalidChildGraph = {
  nodes: {
    source: {
      value: 1,
    },
    result: {
      agent: "copyAgent",
      inputs: { text: ":badsource" },
      isResult: true,
    },
  },
};

test("test nest invalid 1", async () => {
  const result = await graphDataTestRunner(
    __dirname,
    "test_nest_invalid",
    graphDataNested,
    { nestedAgent, copyAgent, propertyFilterAgent },
    (graph: GraphAI) => {
      graph.injectValue("source", invalidChildGraph);
    },
    false,
  );
  assert.deepStrictEqual(result.catch, {
    message: "\x1B[41mInputs not match: NodeId result, Inputs: badsource\x1B[0m",
  });
});

const invalidChildGraph2 = {
  nodes: {
    source: {
      agent: "invalidAgent",
    },
    result: {
      agent: "copyAgent",
      inputs: [":badsource"],
      isResult: true,
    },
  },
};

test("test nest invalid 2", async () => {
  const result = await graphDataTestRunner(
    __dirname,
    "test_nest_invalid2",
    graphDataNested,
    { nestedAgent, copyAgent, propertyFilterAgent },
    (graph: GraphAI) => {
      graph.injectValue("source", invalidChildGraph2);
    },
    false,
  );
  assert.deepStrictEqual(result.catch, {
    message: "\x1B[41mInvalid Agent : invalidAgent is not in AgentFunctionInfoDictionary.\x1B[0m",
  });
});

const graphdataMapped = {
  version: 0.5,
  nodes: {
    source: {
      value: validChildGraph,
    },
    array: {
      value: [1, 2, 3],
    },
    nested: {
      agent: "mapAgent",
      graph: ":source",
      isResult: true,
      inputs: { rows: ":array" },
    },
    catch: {
      agent: "propertyFilterAgent",
      params: {
        include: ["message"],
      },
      if: ":nested.onError",
      inputs: { item: ":nested.onError" },
      isResult: true,
    },
  },
};

test("test map invalid 3", async () => {
  const result = await graphDataTestRunner(
    __dirname,
    "test_map_invalid",
    graphdataMapped,
    { mapAgent, copyAgent, propertyFilterAgent },
    (graph: GraphAI) => {
      graph.injectValue("source", invalidChildGraph);
    },
    false,
  );
  assert.deepStrictEqual(result.catch, {
    message: "\x1B[41mInputs not match: NodeId result, Inputs: badsource\x1B[0m",
  });
});
