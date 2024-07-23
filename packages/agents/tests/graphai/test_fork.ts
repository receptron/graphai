import { AgentFunction, agentInfoWrapper } from "graphai";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@/index";

import test from "node:test";
import assert from "node:assert";

const testAgent1: AgentFunction = async ({ debugInfo: { nodeId }, inputs }) => {
  const result = {
    [nodeId]: [nodeId, inputs.map((a) => Object.values(a).flat())]
      .flat()
      .filter((a) => !!a)
      .join(":"),
  };
  return result;
};

const testAgent1a: AgentFunction = async ({ debugInfo: { nodeId }, inputs }) => {
  const result = {
    [nodeId]: [
      nodeId,
      inputs.map((a) => {
        return Object.values(a);
      }),
    ]
      .flat()
      .filter((a) => !!a)
      .join(":"),
  };
  return result;
};

test("test fork 1", async () => {
  const forkGraph = {
    version: 0.5,
    nodes: {
      node1: {
        agent: "testAgent1a",
      },
      node2: {
        agent: "copy2ArrayAgent",
        params: { count: 10 },
        inputs: [":node1"],
      },
      mapNode: {
        agent: "mapAgent",
        inputs: { rows: ":node2" },
        graph: {
          version: 0.5,
          nodes: {
            buffer: {
              value: {},
            },
            node2: {
              agent: "testAgent1a",
              inputs: [":row"],
            },
            node3: {
              agent: "testAgent1a",
              inputs: [":node2"],
              isResult: true,
            },
          },
        },
      },
    },
  };

  const result = await graphDataTestRunner(__dirname, __filename, forkGraph, {
    testAgent1a: agentInfoWrapper(testAgent1a),
    ...agents,
  });
  // console.log(JSON.stringify(result, null, "  "));
  assert.deepStrictEqual(result, {
    node1: {
      node1: "node1",
    },
    node2: [
      { node1: "node1" },
      { node1: "node1" },
      { node1: "node1" },
      { node1: "node1" },
      { node1: "node1" },
      { node1: "node1" },
      { node1: "node1" },
      { node1: "node1" },
      { node1: "node1" },
      { node1: "node1" },
    ],
    mapNode: {
      node3: [
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
      ],
    },
  });
});

test("test fork 2", async () => {
  const forkGraph = {
    version: 0.5,
    nodes: {
      echo: {
        agent: "copyMessageAgent",
        params: {
          message: "hello",
          count: 10,
        },
      },
      mapNode: {
        agent: "mapAgent",
        inputs: { rows: ":echo.messages" },
        graph: {
          version: 0.5,
          nodes: {
            node1: {
              agent: "testAgent1",
              params: {},
            },
            node2: {
              agent: "testAgent1",
              params: {},
              inputs: [":node1"],
            },
            node3: {
              agent: "testAgent1",
              params: {},
              inputs: [":node2"],
              isResult: true,
            },
          },
        },
      },
    },
  };

  const result = await graphDataTestRunner(__dirname, __filename, forkGraph, {
    testAgent1: agentInfoWrapper(testAgent1),
  });
  // console.log(JSON.stringify(result, null, "  "));
  assert.deepStrictEqual(result, {
    echo: {
      messages: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
    },
    mapNode: {
      node3: [
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
        { node3: "node3:node2:node1" },
      ],
    },
  });
});

test("test fork 3", async () => {
  const forkGraph = {
    version: 0.5,
    nodes: {
      source: {
        value: { content: [{ level1: { level2: "hello1" } }, { level1: { level2: "hello2" } }] },
      },
      mapNode: {
        agent: "mapAgent",
        inputs: { rows: ":source.content" },
        graph: {
          version: 0.5,
          nodes: {
            workingMemory: {
              value: {},
            },
            forked: {
              agent: "sleeperAgent",
              inputs: [":row.level1"],
            },
            forked2: {
              agent: "sleeperAgent",
              inputs: [":forked"],
              isResult: true,
            },
          },
        },
      },
      bypassAgent: {
        agent: "bypassAgent",
        inputs: [":mapNode"],
      },
    },
  };

  const result = await graphDataTestRunner(__dirname, __filename, forkGraph, agents);
  // console.log(JSON.stringify(result, null, "  "));
  assert.deepStrictEqual(result, {
    source: { content: [{ level1: { level2: "hello1" } }, { level1: { level2: "hello2" } }] },
    mapNode: { forked2: [{ level2: "hello1" }, { level2: "hello2" }] },
    bypassAgent: [{ forked2: [{ level2: "hello1" }, { level2: "hello2" }] }],
  });
});
