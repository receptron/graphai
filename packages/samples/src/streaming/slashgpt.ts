import "dotenv/config";

import { GraphAI } from "graphai";
import * as agents from "@graphai/agents";
import { agentFilters } from "./streamAgentFilter";

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
  const graph = new GraphAI(graph_data, agents, { agentFilters });
  const result = await graph.run();
  console.log(JSON.stringify(result));

  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
