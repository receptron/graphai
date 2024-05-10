import "dotenv/config";

import { GraphAI } from "@/graphai";

import { AgentFunctionContext } from "@/type";
import { slashGPTAgent } from "@/experimental_agents/llm_agents/slashgpt_agent";
import { streamAgentFilterGenerator } from "@/experimental_agent_filters/stream";

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
  version: 0.3,
  nodes: {
    node: {
      agent: "slashGPTAgent",
      params: {
        query: "Please tell me about photosynthesis in 50 words.",
      },
      isResult: true,
    },
  },
};

export const main = async () => {
  const graph = new GraphAI(graph_data, { slashGPTAgent }, { agentFilters });
  const result = await graph.run();
  console.log(JSON.stringify(result));

  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
