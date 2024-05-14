import "dotenv/config";

import { graphDataTestRunner } from "~/utils/runner";
import { AgentFunction } from "@/graphai";
import { agentInfoWrapper } from "@/utils/utils";

const fibonacciAgent: AgentFunction = async ({ inputs }) => {
  const prev = inputs[0];
  console.log(prev);
  return [prev[1], prev[0] + prev[1]];
};

const graph_data = {
  version: 0.3,
  loop: {
    count: 1000,
  },
  nodes: {
    data: {
      value: [1, 1],
      update: ":fibonacci",
    },
    fibonacci: {
      agent: "fibonacciAgent",
      inputs: [":data"],
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner("fibonacci", graph_data, { fibonacciAgent: agentInfoWrapper(fibonacciAgent) });
  console.log(result);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
