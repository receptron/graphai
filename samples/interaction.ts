import "dotenv/config";

import { GraphAI, GraphData } from "@/graphai";
import * as readline from "readline";
import { mergeNodeIdAgent } from "~/agents/agents";
import { graphDataTestRunner } from "~/utils/runner";

const getUserInput = async (question: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const graph_data: GraphData = {
  repeat: 3,
  nodes: {
    node1: {
      source: true,
    },
    node2: {
      inputs: ["node1"],
    },
  },
};

export const main = async () => {
  const query = await getUserInput("Please enter your question: ");
  console.log("query=", query);
  graph_data.nodes.node1.result = { query };

  const result = await graphDataTestRunner(__filename, graph_data, mergeNodeIdAgent);
  console.log(result);

  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
