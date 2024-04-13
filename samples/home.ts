import { GraphAI, GraphData } from "@/graphai";
import path from "path";
import * as fs from "fs";
import { slashGPTAgent } from "@/experimental_agents";
import { graphDataTestRunner } from "~/utils/runner";

const home_actions = {
  fill_bath: { type: "message_template", message: "Success. I started filling the bath tab." },
  set_temperature: { type: "message_template", message: "Success. I set the temperature to {temperature} for {location}" },
  start_sprinkler: { type: "message_template", message: "Success. I started the sprinkler for {location}" },
  take_picture: { type: "message_template", message: "Success. I took a picture of {location}" },
  play_music: { type: "message_template", message: "Success. I started playing {music} in {location}" },
  control_light: { type: "message_template", message: "Success. The light switch of {location} is now {switch}." },
};

const fileName = path.resolve(__dirname) + "/home.json";
const json_file = fs.readFileSync(fileName, "utf8");
const home_functions = JSON.parse(json_file);

const graph_data: GraphData = {
  nodes: {
    node1: {
      source: true,
      result: { content: "Turn on the light in the kitchen" },
    },
    node2: {
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

const main = async () => {
  const result = await graphDataTestRunner("home.yaml",  graph_data, slashGPTAgent);
  console.log(result["node2"]!.content);
  console.log("COMPLETE 1");
};

main();
