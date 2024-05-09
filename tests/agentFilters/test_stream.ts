import { GraphAI } from "@/graphai";
import { AgentFilterFunction, AgentFunctionContext } from "@/type";

import { defaultTestAgents } from "@/utils/test_agents";

import test from "node:test";

const streamData: Record<string, string> = {};

const outSideFunciton = (context: AgentFunctionContext, data: string) => {
  const nodeId = context.debugInfo.nodeId;
  streamData[nodeId] = (streamData[nodeId] || "") + data;
  console.log(streamData);
};

const streamAgentFilterGenerator = <T>(callback: (context: AgentFunctionContext, data: T) => void) => {
  const streamAgentFilter: AgentFilterFunction = async (context, next) => {
    context.filterParams.streamTokenCallback = (data: T) => {
      callback(context, data);
    };
    return next(context);
  };
  return streamAgentFilter;
};

const streamAgentFilter = streamAgentFilterGenerator<string>(outSideFunciton);

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
