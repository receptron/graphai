import { GraphAI } from "@/index";
import { graphDataTestRunner } from "~/utils/runner";
import { nestedAgent, copyAgent, propertyFilterAgent } from "@/experimental_agents";

import test from "node:test";
import assert from "node:assert";

const valid_graph = {
  nodes: {
    source: {
      value: 1
    },
    result: {
      agent: "copyAgent",
      inputs: [":source"],
      isResult: true,
    }
  }
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
        include: ["message"]
      },
      if: ":nested.onError",
      inputs: [":nested.onError"],
      isResult: true,
    }
  },
};

test("test nest valid", async () => {
  const result = await graphDataTestRunner("test_nest_valid", graphdata_nested, { nestedAgent, copyAgent, propertyFilterAgent }, ()=>{}, false);
  assert.deepStrictEqual(result, {
    nested: {
      result: 1
    }
  });
});

const invalid_graph = {
  nodes: {
    source: {
      value: 1
    },
    result: {
      agent: "copyAgent",
      inputs: [":badsource"],
      isResult: true,
    }
  }
};

const invalid_graph2 = {
  nodes: {
    source: {
      agent: "invalidAgent"
    },
    result: {
      agent: "copyAgent",
      inputs: [":badsource"],
      isResult: true,
    }
  }
};

test("test nest invalid", async () => {
  const result = await graphDataTestRunner("test_nest_valid", graphdata_nested, { nestedAgent, copyAgent, propertyFilterAgent },
    (graph: GraphAI) => {
      graph.injectValue("source", invalid_graph);
    }, false);
  assert.deepStrictEqual(result.catch, {
    message: "\x1B[41mInputs not match: NodeId result, Inputs: badsource\x1B[0m"
  });
});
