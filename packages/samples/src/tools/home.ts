import "dotenv/config";

import { GraphData } from "graphai";
import * as agents from "@graphai/agents";
import { graphDataTestRunner } from "@receptron/test_utils";
import { home_functions } from "./home_functions";

const graph_data: GraphData = {
  version: 0.5,
  nodes: {
    node1: {
      value: { content: "Turn on the light in the kitchen" },
    },
    node2: {
      agent: "openAIAgent",
      inputs: {
        model: "gpt-4o-mini",
        system: "You are a smart home assistant. Please operate the appropriate home functions based on the user's request.",
        prompt: ":node1.content",
      },
      params: {
        tool_choice: "auto",
        tools: home_functions,
      },
    },
    node3: {
      agent: "stringTemplateAgent",
      params: { template: "call `${action_name}` with `${action_args}`" },
      inputs: { action_name: ":node2.tool.name", action_args: ":node2.tool.arguments.toJSON()" },
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, agents);
  console.log(result);
  if (result["node3"]) {
    console.log(result["node3"]);
  }
  console.log("COMPLETE 1");
};

main();
