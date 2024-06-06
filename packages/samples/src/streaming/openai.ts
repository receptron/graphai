import "dotenv/config";

import { GraphAI } from "graphai";
import * as agents from "@graphai/agents";
import { agentFilters } from "./streamAgentFilter";

const graph_data = {
  version: 0.3,
  nodes: {
    node1: {
      value: "Please tell me about photosynthesis in 50 words.",
    },
    node2: {
      agent: "openAIAgent",
      params: {
        stream: true,
      },
      inputs: { prompt: ":node1" },
      isResult: true,
    },
  },
};

export const main = async () => {
  // const result = await graphDataTestRunner(__filename, graph_data, { openAIAgent }, { agentFilters });
  const graph = new GraphAI(graph_data, agents, { agentFilters });
  const result = await graph.run();
  console.log(JSON.stringify(result));

  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
