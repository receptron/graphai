import "dotenv/config";

import * as agents from "@graphai/agents";
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
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, {
    ...agents,
    interactiveInputSelectAgent: agentInfoWrapper(interactiveInputSelectAgent),
  });
  console.log(JSON.stringify(result, null, "  "));
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
