import "dotenv/config";

import { countingAgent } from "graphai/lib/experimental_agents";
import { graphDataTestRunner } from "@/utils/test_runner";
import { interactiveInputSelectAgent } from "../utils/agents/interactiveInputAgent";
import { agentInfoWrapper } from "graphai/lib/utils/utils";

const graph_data = {
  version: 0.3,
  nodes: {
    countingAgent: {
      agent: "countingAgent",
      params: {
        count: 10,
      },
    },
    interactiveInputAgent: {
      inputs: [":countingAgent.list"],
      agent: "interactiveInputSelectAgent",
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, {
    countingAgent,
    interactiveInputSelectAgent: agentInfoWrapper(interactiveInputSelectAgent),
  });
  console.log(JSON.stringify(result, null, "  "));
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
