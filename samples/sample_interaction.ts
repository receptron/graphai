import "dotenv/config";

import { countingAgent } from "@/experimental_agents";
import { graphDataTestRunner } from "~/utils/runner";
import { interactiveInputSelectAgent } from "./agents/interactiveInputAgent";

const graph_data = {
  nodes: {
    echoAgent: {
      agentId: "countingAgent",
      params: {
        count: 10,
      },
    },
    interactiveInputAgent: {
      inputs: ["echoAgent.list"],
      agentId: "interactiveInputSelectAgent",
      isResult: true,
    },
  },
};

const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { countingAgent, interactiveInputSelectAgent });
  console.log(JSON.stringify(result, null, "  "));
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
