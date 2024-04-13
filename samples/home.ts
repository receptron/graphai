import { GraphAI, GraphData } from "@/graphai";
import path from "path";
import * as fs from "fs";
import { slashGPTAgent } from "@/experimental_agents";

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

const runAgent = async () => {
  const graph = new GraphAI(graph_data, slashGPTAgent);
  const result = await graph.run();
  const log_path = path.resolve(__dirname) + "/../tests/logs/home.log";
  fs.writeFileSync(log_path, JSON.stringify(graph.transactionLogs(), null, 2));
  console.log(result["node2"]!.content);
};

const main = async () => {
  await runAgent();
  console.log("COMPLETE 1");
};

main();
