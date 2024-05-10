import "dotenv/config";

import { GraphAI } from "@/graphai";

import { AgentFunctionContext } from "@/type";
import { openAIAgent } from "@/experimental_agents/llm_agents/openai_agent";
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
    node1: {
      value: "Please tell me about photosynthesis in 50 words.",
    },
    node2: {
      agent: "openAIAgent",
      inputs: [":node1"],
      isResult: true,
    },
  },
};

export const main = async () => {
  // const result = await graphDataTestRunner(__filename, graph_data, { openAIAgent }, { agentFilters });
  const graph = new GraphAI(graph_data, { openAIAgent }, { agentFilters });
  const result = await graph.run();
  console.log(JSON.stringify(result));

  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
