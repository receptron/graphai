import "dotenv/config";

import { GraphData } from "@/graphai";
import { mergeNodeIdAgent } from "~/agents/agents";
import { graphDataTestRunner } from "~/utils/runner";
import { interactiveInputTextAgent } from "./agents/interactiveInputAgent";

const graph_data: GraphData = {
  loop: {
    count: 3,
    assign: {
      node3: "node1", // result of node3 to node1 at the end of loop
    },
  },
  nodes: {
    node1: {},
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
  graph_data.nodes.node1.value = { injected: "test" };

  const result = await graphDataTestRunner(__filename, graph_data, { merge: mergeNodeIdAgent, input: interactiveInputTextAgent });
  console.log(result);

  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
