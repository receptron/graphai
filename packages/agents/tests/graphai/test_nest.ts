import { GraphAI } from "graphai";
import { graphDataTestRunner } from "@graphai/test_utils";
import { nestedAgent, copyAgent, propertyFilterAgent, mapAgent } from "@/index";

import test from "node:test";
import assert from "node:assert";

const valid_graph = {
  nodes: {
    source: {
      value: 1,
    },
    result: {
      agent: "copyAgent",
      inputs: [":source"],
      isResult: true,
    },
  },
};

const graphdata_nested = {
  version: 0.3,
  nodes: {
    source: {
      value: valid_graph,
    },
    nested: {
      agent: "nestedAgent",
      graph: ":source",
      isResult: true,
    },
    catch: {
      agent: "propertyFilterAgent",
      params: {
        include: ["message"],
      },
      if: ":nested.onError",
      inputs: [":nested.onError"],
      isResult: true,
    },
  },
};

test("test nest valid", async () => {
  const result = await graphDataTestRunner(__dirname, "test_nest_valid", graphdata_nested, { nestedAgent, copyAgent, propertyFilterAgent }, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      result: 1,
    },
  });
});

const invalid_graph = {
  nodes: {
    source: {
      value: 1,
    },
    result: {
      agent: "copyAgent",
      inputs: [":badsource"],
      isResult: true,
    },
  },
};

test("test nest invalid", async () => {
  const result = await graphDataTestRunner(
    __dirname,
    "test_nest_invalid",
    graphdata_nested,
    { nestedAgent, copyAgent, propertyFilterAgent },
    (graph: GraphAI) => {
      graph.injectValue("source", invalid_graph);
    },
    false,
  );
  assert.deepStrictEqual(result.catch, {
    message: "\x1B[41mInputs not match: NodeId result, Inputs: badsource\x1B[0m",
  });
});

const invalid_graph2 = {
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
    graphdata_nested,
    { nestedAgent, copyAgent, propertyFilterAgent },
    (graph: GraphAI) => {
      graph.injectValue("source", invalid_graph2);
    },
    false,
  );
  assert.deepStrictEqual(result.catch, {
    message: "\x1B[41mInvalid Agent : invalidAgent is not in AgentFunctionInfoDictionary.\x1B[0m",
  });
});

const graphdata_mapped = {
  version: 0.3,
  nodes: {
    source: {
      value: valid_graph,
    },
    array: {
      value: [1, 2, 3],
    },
    nested: {
      agent: "mapAgent",
      graph: ":source",
      isResult: true,
      inputs: [":array"],
    },
    catch: {
      agent: "propertyFilterAgent",
      params: {
        include: ["message"],
      },
      if: ":nested.onError",
      inputs: [":nested.onError"],
      isResult: true,
    },
  },
};

test("test map invalid", async () => {
  const result = await graphDataTestRunner(
    __dirname,
    "test_map_invalid",
    graphdata_mapped,
    { mapAgent, copyAgent, propertyFilterAgent },
    (graph: GraphAI) => {
      graph.injectValue("source", invalid_graph);
    },
    false,
  );
  assert.deepStrictEqual(result.catch, {
    message: "\x1B[41mInputs not match: NodeId result, Inputs: badsource\x1B[0m",
  });
});
