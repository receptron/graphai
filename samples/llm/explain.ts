import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { copyAgent, openAIAgent } from "@/experimental_agents";
import * as path from "path";
import * as fs from "fs";
import { graph_data } from "./interview";

const filePath = path.join(__dirname, "../../README.md");
const document = fs.readFileSync(filePath, "utf8");

const graph_data_explain = {
  version: 0.3,
  nodes: {
    reviewer: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system: "You an expert in GraphAI programming. You are responsible in reading the graph data an explain how it works.\n"+
                "Here is the documation of GraphAI.\n" + document,
      },
      inputs: [JSON.stringify(graph_data, null, 2)],
    },
    review: {
      agent: "copyAgent",
      inputs: [":reviewer.choices.$0.message.content"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data_explain, { openAIAgent, copyAgent });
  console.log(result.review);
};

if (process.argv[1] === __filename) {
  main();
}
