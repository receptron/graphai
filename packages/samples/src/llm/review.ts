import "dotenv/config";
import { graphDataTestRunner } from "@/utils/test_runner";
import { copyAgent, openAIAgent } from "graphai/lib/experimental_agents";
import * as path from "path";
import * as fs from "fs";

const filePath = path.join(__dirname, "../../../../README.md");
const document = fs.readFileSync(filePath, "utf8");

const graph_data = {
  version: 0.3,
  nodes: {
    reviewer: {
      // Asks the LLM to review the document.
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system: "You are a professional software engineer, and writer. You are responsible in reviewing a given document and give some feedbacks.",
      },
      inputs: ["Here is the document.\n" + document],
    },
    review: {
      // Extracts the response from the generated message
      agent: "copyAgent",
      inputs: [":reviewer.choices.$0.message.content"],
      isResult: true,
    },
    evangelist: {
      // Asks the LLM to come up with a promoitional phrases.
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system:
          "You are a professional software evangelist. Read the document, and come up with 200 word phrases, which will explain the benefit of GraphUI, emphasizing the benefit of declarative data-flow programming and concurrent processing.",
      },
      inputs: ["Here is the document.\n" + document],
    },
    statement: {
      // Extracts the response from the generated message
      agent: "copyAgent",
      inputs: [":evangelist.choices.$0.message.content"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { openAIAgent, copyAgent });
  console.log("[REVIEW]");
  console.log(result.review);
  console.log("[PROMOTIONAL STATEMENT]");
  console.log(result.statement);
};

if (process.argv[1] === __filename) {
  main();
}
