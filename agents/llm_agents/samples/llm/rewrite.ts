import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as llm_agents from "@/index";
import * as agents from "@graphai/agents";
import * as path from "path";
import * as fs from "fs";

const filePath = path.join(__dirname, "sample.txt");
const document = fs.readFileSync(filePath, "utf8");

const graph_data = {
  version: 0.5,
  verbose: true,
  loop: {
    count: 10,
  },
  nodes: {
    document: {
      value: document,
      update: ":reviewer.choices.$0.message.content",
    },
    review: {
      agent: (input: unknown) => {
        console.log(input);
        return input;
      },
      inputs: [":document"],
    },
    textInputAgent: {
      agent: "textInputAgent",
      params: {
        message: "この文章に対して指示をしてください",
      },
      inputs: ["review"],
    },
    prompt: {
      agent: "stringTemplateAgent",
      params: {
        template: "${0}\n----------\n${1}\n${2}",
      },
      inputs: [":textInputAgent", "ユーザの書いた文章は以下です. \n", ":document"],
    },
    reviewer: {
      agent: "openAIAgent",
      params: {
        verbose: true,
        // model: "gpt-4o",
        model: "gpt-3.5-turbo-0125",
        system:
          "あなたは敏腕編集者です。ユーザの指示に従い、文章を修正してください。修正後の結果の文章だけ提示し、他に余計なことは言わないでください。質問がある場合でも質問をしないで修正をしてください",
      },
      inputs: { prompt: ":prompt" },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { ...agents, ...llm_agents });
  console.log(result.review);
};

if (process.argv[1] === __filename) {
  main();
}
