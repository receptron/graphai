import "dotenv/config";

import { GraphAI } from "@/graphai";
import { readGraphaiData } from "~/utils/file_utils";

import { echoForkIndexAgent } from "~/agents/agents";
import { graphDataTestRunner } from "~/utils/runner";
import { interactiveInputSelectAgent } from "./agents/interactiveInputAgent";

import { select } from "@inquirer/prompts";

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
