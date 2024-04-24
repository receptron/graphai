import "dotenv/config";

import { echoForkIndexAgent } from "@/experimental_agents";
import { graphDataTestRunner } from "~/utils/runner";
import { interactiveInputSelectAgent } from "./agents/interactiveInputAgent";

const graph_data = {
  nodes: {
    echoAgent: {
      agentId: "echoForkIndexAgent",
      fork: 10,
    },
    interactiveInputAgent: {
      inputs: ["echoAgent"],
      agentId: "interactiveInputSelectAgent",
    },
  },
};

const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { echoForkIndexAgent, interactiveInputSelectAgent });
  console.log(result);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
