import { graphDataTestRunner } from "~/utils/runner";
import { nestedAgent, copyAgent } from "@/experimental_agents";

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

const graphdata_nest_valid = {
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
  },
};

test("test nest valid", async () => {
  const result = await graphDataTestRunner("test_nest_valid", graphdata_nest_valid, { nestedAgent, copyAgent }, ()=>{}, false);
  assert.deepStrictEqual(result, {
    nested: {
      result: 1
    }
  });
});

const graphdata_nest_invalid = {
  version: 0.3,
  nodes: {
    source: {
      value: invalid_graph,
    },
    nested: {
      agent: "nestedAgent",
      graph: ":source",
      isResult: true,
    },
  },
};

test("test nest valid", async () => {
  const result = await graphDataTestRunner("test_nest_valid", graphdata_nest_invalid, { nestedAgent, copyAgent }, ()=>{}, false);
  assert.deepStrictEqual(result, {
    nested: {
      result: 1
    }
  });
});
