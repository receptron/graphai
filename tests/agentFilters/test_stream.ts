import { GraphAI } from "@/graphai";
import { AgentFunctionContext } from "@/type";

import { defaultTestAgents } from "@/utils/test_agents";
import { streamAgentFilterGenerator } from "@/experimental_agent_filters/stream";

import test from "node:test";

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
  version: 0.2,
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
      //inputs: [],
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
  const graph = new GraphAI(graph_data, { ...defaultTestAgents }, { agentFilters });
  const result = await graph.run();
  console.log(JSON.stringify(result));
  // assert.deepStrictEqual(result, { bypassAgent: [{ message: "hello", filter: ["1", "2"] }] });
});
