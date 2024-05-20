import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { jsonParserAgent } from "@/experimental_agents";

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
    source: {
      value: graphdata_child,
    },
    nested: {
      agent: "nestedAgent",
      graph: ":source",
      isResult: true
    }
  }
};

test("test dynamic graph", async () => {
  const result = await graphDataTestRunner(__filename, graphdata, { jsonParserAgent, ...defaultTestAgents }, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      reducer: ["hello", "hello", "hello", "hello", "hello"],
    }
  });
});

const graphdata2 = {
  version: 0.3,
  nodes: {
    source: {
      value: JSON.stringify(graphdata_child),
    },
    parser: {
      agent: "jsonParserAgent",
      inputs: [":source"]
    },
    nested: {
      agent: "nestedAgent",
      graph: ":parser",
      isResult: true
    }
  }
};

test("test dynamic graph parser", async () => {
  const result = await graphDataTestRunner(__filename, graphdata2, { jsonParserAgent, ...defaultTestAgents }, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      reducer: ["hello", "hello", "hello", "hello", "hello"],
    }
  });
});

const graphdata3 = {
  version: 0.3,
  nodes: {
    source: {
      value: "```\n" + JSON.stringify(graphdata_child) + "\n```\n",
    },
    parser: {
      agent: "jsonParserAgent",
      inputs: [":source"]
    },
    nested: {
      agent: "nestedAgent",
      graph: ":parser",
      isResult: true
    }
  }
};

test("test dynamic graph parser extra", async () => {
  const result = await graphDataTestRunner(__filename, graphdata3, { jsonParserAgent, ...defaultTestAgents }, () => {}, false);
  assert.deepStrictEqual(result, {
    nested: {
      reducer: ["hello", "hello", "hello", "hello", "hello"],
    }
  });
});
