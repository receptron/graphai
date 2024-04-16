import "dotenv/config";

import { GraphData } from "@/graphai";
import { slashGPTAgent } from "@/experimental_agents";
import { graphDataTestRunner } from "~/utils/runner";
import { home_functions } from "./home_functions";

const home_actions = {
  fill_bath: { type: "message_template", message: "Success. I started filling the bath tab." },
  set_temperature: { type: "message_template", message: "Success. I set the temperature to {temperature} for {location}" },
  start_sprinkler: { type: "message_template", message: "Success. I started the sprinkler for {location}" },
  take_picture: { type: "message_template", message: "Success. I took a picture of {location}" },
  play_music: { type: "message_template", message: "Success. I started playing {music} in {location}" },
  control_light: { type: "message_template", message: "Success. The light switch of {location} is now {switch}." },
};

const graph_data: GraphData = {
  nodes: {
    node1: {
      result: { content: "Turn on the light in the kitchen" },
    },
    node2: {
      agentId: "slashGPTAgent",
      inputs: ["node1"],
      params: {
        manifest: {
          skip_function_result: true,
          actions: home_actions,
          functions: home_functions,
        },
      },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { slashGPTAgent });
  console.log(result["node2"]!.content);
  console.log("COMPLETE 1");
};

main();
