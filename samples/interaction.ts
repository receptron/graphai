import "dotenv/config";

import { mergeNodeIdAgent } from "@/experimental_agents";
import { graphDataTestRunner } from "~/utils/runner";
import { interactiveInputTextAgent } from "./agents/interactiveInputAgent";

const graph_data = {
  version: 0.3,
  loop: {
    count: 3,
  },
  nodes: {
    node1: {
      value: {},
      update: ":node3",
    },
    node2: {
      agent: "input",
    },
    node3: {
      inputs: [":node1", ":node2"],
      agent: "merge",
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
