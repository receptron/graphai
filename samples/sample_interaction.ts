
import { GraphAI, AgentFunction } from "@/graphai";
import { readGraphaiData } from "~/utils/file_utils";

import { echoForkIndexAgent } from "~/agents/agents";
import { graphDataTestRunner } from "~/utils/runner";

import { select } from '@inquirer/prompts';

const graph_data = {
  nodes: {
    echoAgent: {
      agentId: "echoForkIndexAgent",
      fork: 10,
    },
    interactiveInputAgent: {
      inputs: ["echoAgent"],
      agentId: "interactiveInputAgent",
    },
  },
};

const interactiveInputAgent: AgentFunction = async ({inputs}) => {
  
  const choices = Array.from(inputs.keys()).map(k => {
    return  {
      name: "input_" + String(k),
      value: String(k),
    }
  })
  console.log(choices)
  const answer = await select({
    message: "which one do you like?",
    choices,
  });
  return {answer};
};

const main = async () => {
  const result = await graphDataTestRunner("sample_interaction.yaml",  graph_data, { echoForkIndexAgent, interactiveInputAgent });
  console.log(result)
  console.log("COMPLETE 1");
};
main();
