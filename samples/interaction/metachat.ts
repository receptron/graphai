import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { copyAgent, openAIAgent } from "@/experimental_agents";
import * as path from "path";
import * as fs from "fs";
import { graph_data } from "./reception";

const filePath = path.join(__dirname, "../../README.md");
const document = fs.readFileSync(filePath, "utf8");

const graph_data_explain = {
  version: 0.3,
  nodes: {
    describer: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system:
          "You an expert in GraphAI programming. You are responsible in generating a graphAI graph to get required information from the user.\n" +
          "[documation of GraphAI]\n" +
          document + "\n" +
          "[Sample Question and Answer]\n" +
          "[Question]\n" +
          "Name, Date of Birth and Gendar\n" + 
          "[Answer]\n" +
          graph_data
      },
      inputs: ["Name", "Address", "Phone Number"],
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