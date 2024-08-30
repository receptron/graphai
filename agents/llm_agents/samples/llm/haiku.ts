import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@/index";
import { sleeperAgent } from "@graphai/agents";

const system_prompt = "あなたは、俳句の達人です。与えられたトピックの俳句を１０句詠んで、JSON arrayで返して。";

const graph_data = {
  version: 0.5,
  nodes: {
    messages: {
      value: [
        {
          role: "system",
          content: system_prompt,
        },
        {
          role: "user",
          content: "蛙、静けさ"
        }
      ],
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
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { sleeperAgent, ...agents }, () => {},
  false);
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
