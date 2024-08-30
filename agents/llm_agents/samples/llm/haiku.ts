import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

const haiku_prompt = "あなたは、俳句の達人です。与えられたトピックの俳句を４０句詠んで、call function 'generated'。";
const review_prompt = "あなたは、俳句の評論家です。季節感を重視して与えられた俳句を評価し、良いものを５つ選んで、call function 'generated'。";

const tools_haiku = [
  {
    type: "function",
    function: {
      name: "generated",
      description: "report generated strings",
      parameters: {
        type: "object",
        properties: {
          strings: {
            type: "array",
            items: {
              type: "string",
            },
            description: "generated strings",
          },
        },
        required: ["strings"],
      },
    },
  },
];

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
            content: haiku_prompt,
          },
          {
            role: "user",
            content: "${0}",
          },
        ],
      },
      inputs: [":topic"],
    },
    query: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        tools: tools_haiku,
        temparature: 0.3,
        tool_choice: { type: "function", function: { name: "generated" } },
      },
      inputs: { messages: ":messages" },
    },
    messages2: {
      agent: "stringTemplateAgent",
      params: {
        template: [
          {
            role: "system",
            content: review_prompt,
          },
          {
            role: "user",
            content: "${0}",
          },
        ],
      },
      inputs: [":query.choices.$0.message.tool_calls.$0.function.arguments"],
    },
    query2: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        tools: tools_haiku,
        tool_choice: { type: "function", function: { name: "generated" } },
      },
      inputs: { messages: ":messages2" },
    },
    parser: {
      agent: "jsonParserAgent",
      inputs: [":query2.choices.$0.message.tool_calls.$0.function.arguments"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { ...agents }, () => {}, false);
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
