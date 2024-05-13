import "dotenv/config";

import { GraphData } from "@/graphai";
import { slashGPTAgent } from "@/experimental_agents/packages";
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
  version: 0.3,
  nodes: {
    node1: {
      value: { content: "Turn on the light in the kitchen" },
    },
    node2: {
      agent: "slashGPTAgent",
      inputs: [":node1.content"],
      params: {
        manifest: {
          skip_function_result: true,
          actions: home_actions,
          functions: home_functions,
        },
      },
    },
    node3: {
      agent: "bypassAgent",
      inputs: [":node2.$last.content"],
      isResult: true,
      params: {
        firstElement: true,
      },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { slashGPTAgent });
  console.log(result);
  if (result["node3"]) {
    console.log(result["node3"]);
  }
  console.log("COMPLETE 1");
};

main();
