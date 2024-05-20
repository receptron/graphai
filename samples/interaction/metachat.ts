import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { copyAgent, openAIAgent } from "@/experimental_agents";
import * as path from "path";
import * as fs from "fs";
import { graph_data } from "./reception";

const filePath = path.join(__dirname, "../../README.md");
const document = fs.readFileSync(filePath, "utf8");

const messages = [
  {
    role: "system",
    content:
      "You an expert in GraphAI programming. You are responsible in generating a graphAI graph to get required information from the user.\n" +
      "[documation of GraphAI]\n" +
      document,
  },
  {
    role: "user",
    content: "Name, Date of Birth and Gendar",
  },
  {
    role: "assistant",
    content: "```json\n" + JSON.stringify(graph_data) + "```\n",
  },
];

const graph_data_explain = {
  version: 0.3,
  nodes: {
    describer: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
      },
      inputs: ["Name, Address and Phone Number", messages],
    },
    description: {
      agent: "copyAgent",
      inputs: [":describer.choices.$0.message.content"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data_explain, { openAIAgent, copyAgent });
  console.log(result.description);
};

if (process.argv[1] === __filename) {
  main();
}
