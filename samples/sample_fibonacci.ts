import "dotenv/config";

import { graphDataTestRunner } from "~/utils/runner";
import { AgentFunction } from "@/graphai";

const fibonacciAgent: AgentFunction = async ({ inputs }) => {
  const prev = inputs[0];
  console.log(prev);
  return [prev[1], prev[0] + prev[1]];
};

const graph_data = {
  loop: {
    count: 1000,
  },
  nodes: {
    data: {
      value: [1, 1],
      update: "agent",
    },
    agent: {
      agentId: "fibonacciAgent",
      inputs: ["data"],
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner("fibonacci", graph_data, { fibonacciAgent });
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
