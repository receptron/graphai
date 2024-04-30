import { AgentFunction } from "@/graphai";

import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";

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
    nodes: {
      node1: {
        agentId: "testAgent1a",
      },
      node2: {
        agentId: "copy2ArrayAgent",
        params: { count: 10 },
        inputs: ["node1"],
      },
      mapNode: {
        agentId: "mapAgent",
        inputs: ["node2"],
        params: {
          injectionTo: ["buffer"],
        },
        graph: {
          nodes: {
            buffer: {
              value: {},
            },
            node2: {
              agentId: "testAgent1a",
              inputs: ["buffer"],
            },
            node3: {
              agentId: "testAgent1a",
              inputs: ["node2"],
              isResult: true,
            },
          },
        },
      },
    },
  };

  const result = await graphDataTestRunner(__filename, forkGraph, { testAgent1a, ...defaultTestAgents });
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
    nodes: {
      echo: {
        agentId: "copyMessageAgent",
        params: {
          message: "hello",
          count: 10,
        },
      },
      mapNode: {
        agentId: "mapAgent",
        inputs: ["echo.messages"],
        graph: {
          nodes: {
            node1: {
              agentId: "testAgent1",
              params: {},
            },
            node2: {
              agentId: "testAgent1",
              params: {},
              inputs: ["node1"],
            },
            node3: {
              agentId: "testAgent1",
              params: {},
              inputs: ["node2"],
              isResult: true,
            },
          },
        },
      },
    },
  };

  const result = await graphDataTestRunner(__filename, forkGraph, { testAgent1 });
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
    nodes: {
      source: {
        value: { content: [{ level1: { level2: "hello1" } }, { level1: { level2: "hello2" } }] },
      },
      mapNode: {
        agentId: "mapAgent",
        inputs: ["source.content"],
        params: {
          injectionTo: ["workingMemory"],
        },
        graph: {
          nodes: {
            workingMemory: {
              value: {},
            },
            forked: {
              agentId: "sleeperAgent",
              inputs: ["workingMemory.level1"],
            },
            forked2: {
              agentId: "sleeperAgent",
              inputs: ["forked"],
              isResult: true,
            },
          },
        },
      },
      bypassAgent: {
        agentId: "bypassAgent",
        inputs: ["mapNode"],
      },
    },
  };

  const result = await graphDataTestRunner(__filename, forkGraph, defaultTestAgents);
  // console.log(JSON.stringify(result, null, "  "));
  assert.deepStrictEqual(result, {
    source: { content: [{ level1: { level2: "hello1" } }, { level1: { level2: "hello2" } }] },
    mapNode: { forked2: [{ level2: "hello1" }, { level2: "hello2" }] },
    bypassAgent: [{ forked2: [{ level2: "hello1" }, { level2: "hello2" }] }],
  });
});
