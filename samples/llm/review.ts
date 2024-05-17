import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { copyAgent, openAIAgent } from "@/experimental_agents";
import * as path from "path";
import * as fs from "fs";

const filePath = path.join(__dirname, "../../README.md")
const document = fs.readFileSync(filePath, 'utf-8');

const graph_data = {
  version: 0.3,
  nodes: {
    query: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system: "You are a professional software engineer, and writer. You are responsible in reviewing a given document and give some feedbacks."
      },
      inputs: ["Here is the document.\n" + document],
    },
    answer: {
      agent: "copyAgent",
      inputs: [":query.choices.$0.message.content"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { openAIAgent, copyAgent });
  console.log(result.answer);
};

if (process.argv[1] === __filename) {
  main();
}
