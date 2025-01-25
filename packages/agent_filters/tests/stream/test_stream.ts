import type { AgentFunctionContext } from "graphai";
import { GraphAI, graphDataLatestVersion, sleep } from "graphai";
import * as agents from "@graphai/agents";
import { streamAgentFilterGenerator } from "@/index";

import test from "node:test";
import assert from "node:assert";

const streamData: Record<string, string> = {};

const outSideFunciton = (context: AgentFunctionContext, data: string) => {
  const nodeId = context.debugInfo.nodeId;
  streamData[nodeId] = (streamData[nodeId] || "") + data;
  console.log(streamData);
};

const agentFilters = [
  {
    name: "streamAgentFilter",
    agent: streamAgentFilterGenerator<string>(outSideFunciton),
  },
];

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    echo: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
    },
    streamMockAgent: {
      agent: "streamMockAgent",
      params: {
        message: "this is streaming test1",
        sleep: 10,
      },
      isResult: true,
    },
    streamMockAgent2: {
      agent: "streamMockAgent",
      params: {
        message: "こんにちは。こちらはstreamingのテストです",
        sleep: 20,
      },
      isResult: true,
    },
  },
};

test("test agent filter", async () => {
  const graph = new GraphAI(graph_data, { ...agents }, { agentFilters });
  const result = await graph.run();
  console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, {
    streamMockAgent: { message: "this is streaming test1" },
    streamMockAgent2: { message: "こんにちは。こちらはstreamingのテストです" },
  });
});

test("test agent filter abort", async () => {
  const graph = new GraphAI(graph_data, agents, { agentFilters });

  await assert.rejects(async () => {
    await Promise.all([
      (async () => {
        const result = await graph.run(true);
        assert.deepStrictEqual(result, {
          message: "Hello World",
          sleep1: {
            text: "Hello World",
          },
        });
      })(),
      (async () => {
        await sleep(100);
        graph.abort();
      })(),
    ]);
  });
});
