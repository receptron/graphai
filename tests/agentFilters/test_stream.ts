import { GraphAI } from "@/graphai";
import { AgentFilterFunction } from "@/type";

// import { sleep } from "@/utils/utils";
import { defaultTestAgents } from "@/utils/test_agents";

import test from "node:test";
// import assert from "node:assert";

const streamData: Record<string, string> = {};

const outSideFunciton = (nodeId: string, token: string) => {
  streamData[nodeId] = (streamData[nodeId] || "") + token;
  console.log(streamData);
};

const streamAgentFilter: AgentFilterFunction = async (context, next) => {
  context.params.streamCallback = (token: string) => {
    outSideFunciton(context.debugInfo.nodeId, token);
  };
  return next(context);
};

const agentFilters = [
  {
    name: "streamAgentFilter",
    agent: streamAgentFilter,
  },
];

const graph_data = {
  version: 0.2,
  nodes: {
    echo: {
      agentId: "echoAgent",
      params: {
        message: "hello",
      },
    },
    streamMockAgent: {
      agentId: "streamMockAgent",
      params: {
        message: "this is streaming test1",
        sleep: 10,
      },
      //inputs: [],
      isResult: true,
    },
    streamMockAgent2: {
      agentId: "streamMockAgent",
      params: {
        message: "こんにちは。こちらはstreamingのテストです",
        sleep: 20,
      },
      isResult: true,
    },
  },
};

test("test agent filter", async () => {
  const graph = new GraphAI(graph_data, { ...defaultTestAgents }, { agentFilters });
  const result = await graph.run();
  console.log(JSON.stringify(result));
  // assert.deepStrictEqual(result, { bypassAgent: [{ message: "hello", filter: ["1", "2"] }] });
});
