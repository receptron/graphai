import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
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
      update: ":reviewer.text",
    },
    review: {
      agent: "copyAgent",
      console: {
        before: true,
      },
      inputs: { document: ":document" },
    },
    textInputAgent: {
      agent: "textInputAgent",
      params: {
        message: "この文章に対して指示をしてください",
      },
    },
    reviewer: {
      agent: "openAIAgent",
      params: {
        verbose: true,
        model: "gpt-4o",
        system:
          "あなたは敏腕編集者です。ユーザの指示に従い、文章を修正してください。修正後の結果の文章だけ提示し、他に余計なことは言わないでください。質問がある場合でも質問をしないで修正をしてください",
      },
      inputs: { prompt: "${:textInputAgent.text}\n----------\nユーザの書いた文章は以下です. \n\n${:document}" },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { ...agents });
  console.log(result.review);
};

if (process.argv[1] === __filename) {
  main();
}
