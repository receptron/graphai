import { AgentFunction, agentInfoWrapper } from "graphai";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as vanilla_agents from "@/index";
import { sleepAndMergeAgent } from "@graphai/sleeper_agents";
const agents = {
  sleepAndMergeAgent,
  ...vanilla_agents,
};

import { forkGraph } from "./graphData";

import test from "node:test";
import assert from "node:assert";

const testAgent1: AgentFunction = async ({ debugInfo: { nodeId }, namedInputs }) => {
  const inputs: Record<string, unknown>[] = namedInputs.array ?? [];
  const result = {
    [nodeId]: [nodeId, inputs.map((a) => Object.values(a).flat())]
      .flat()
      .filter((a) => !!a)
      .join(":"),
  };
  return result;
};

const testAgent1a: AgentFunction = async ({ debugInfo: { nodeId }, namedInputs }) => {
  const inputs: Record<string, unknown>[] = namedInputs.array ?? [];
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
  const forkGraph1 = {
    version: 0.5,
    nodes: {
      node1: {
        agent: "testAgent1a",
      },
      node2: {
        agent: "copy2ArrayAgent",
        params: { count: 10 },
        inputs: { item: ":node1" },
      },
      mapNode: {
        agent: "mapAgent",
        inputs: { rows: ":node2" },
        params: {
          compositeResult: true,
        },
        graph: {
          version: 0.5,
          nodes: {
            buffer: {
              value: {},
            },
            node2: {
              agent: "testAgent1a",
              inputs: { array: [":row"] },
            },
            node3: {
              agent: "testAgent1a",
              inputs: { array: [":node2"] },
              isResult: true,
            },
          },
        },
      },
    },
  };

  const result = await graphDataTestRunner(__dirname, __filename, forkGraph1, {
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
  const forkGraph2 = {
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
        params: {
          compositeResult: true,
        },
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
              inputs: { array: [":node1"] },
            },
            node3: {
              agent: "testAgent1",
              params: {},
              inputs: { array: [":node2"] },
              isResult: true,
            },
          },
        },
      },
    },
  };

  const result = await graphDataTestRunner(__dirname, __filename, forkGraph2, {
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
  const result = await graphDataTestRunner(__dirname, __filename, forkGraph, agents);
  assert.deepStrictEqual(result, {
    source: { content: [{ level1: { level2: "hello1" } }, { level1: { level2: "hello2" } }] },
    mapNode: { forked2: [{ level2: "hello1" }, { level2: "hello2" }] },
    bypassAgent: [{ forked2: [{ level2: "hello1" }, { level2: "hello2" }] }],
  });
});
