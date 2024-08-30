import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

const system_prompt = "あなたは、俳句の達人です。与えられたトピックの俳句を１０句詠んで、JSON arrayで返して。";

const graph_data = {
  version: 0.5,
  nodes: {
    topic: {
      // Gets the research topic from the user.
      agent: "textInputAgent",
      params: {
        message: "含めたいトピック（複数可）を入力してください:",
      },
    },
    messages: {
      agent: "stringTemplateAgent",
      params: {
        template: [
          {
            role: "system",
            content: system_prompt,
          },
          {
            role: "user",
            content: "${0}"
          }
        ],
      },
      inputs: [":topic"],
      isResult: true,
    },
    query: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
      },
      inputs: { messages: ":messages" },
    },
    answer: {
      agent: "sleeperAgent",
      inputs: [":query.choices.$0.message"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { ...agents }, () => {},
  false);
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
