import "dotenv/config";

import { GraphAI, GraphData } from "@/graphai";
import * as readline from "readline";
import { mergeNodeIdAgent } from "~/agents/agents";
import { graphDataTestRunner } from "~/utils/runner";
import { interactiveInputTextAgent } from "./agents/interactiveInputAgent";

const graph_data: GraphData = {
  repeat: 3,
  nodes: {
    node1: {
      source: true,
    },
    node2: {
      agentId: "input",
    },
    node3: {
      inputs: ["node1", "node2"],
      agentId: "merge",
    },
  },
};

export const main = async () => {
  graph_data.nodes.node1.result = { injected: "test" };

  const result = await graphDataTestRunner(__filename, graph_data, { merge: mergeNodeIdAgent, input: interactiveInputTextAgent });
  console.log(result);

  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
