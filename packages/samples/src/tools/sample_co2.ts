import "dotenv/config";

import * as agents from "@graphai/agents";

import { graphDataTestRunner } from "@receptron/test_utils";
import { GraphData } from "graphai";

const graph_data: GraphData = {
  verbose: true,
  version: 0.5,
  nodes: {
    openAIAgent: {
      agent: "openAIAgent",
      inputs: {
        model: "gpt-4o-mini",
        system: "あなたは世界経済の専門家です。ユーザの問い合わせについて考え、10この結果をfunctionsの結果に返してください。",
        prompt: "世界で協力してco2を減らす方法を教えて下さい",
      },
      params: {
        tool_choice: "auto",
        tools: [
          {
            type: "function",
            function: {
              name: "your_ideas",
              description: "Your answer to a user's inquiry",
              parameters: {
                type: "object",
                properties: {
                  methods: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: {
                          type: "string",
                          description: "title",
                        },
                        description: {
                          type: "string",
                          description: "description",
                        },
                      },
                      required: ["title", "description"],
                    },
                  },
                },
                required: ["methods"],
              },
            },
          },
        ],
      },
    },
    mapNode: {
      agent: "mapAgent",
      inputs: { rows: ":openAIAgent.tool.arguments.methods" },
      graph: {
        nodes: {
          openAIAgent0: {
            agent: "openAIAgent",
            params: {
              model: "gpt-4o-mini",
            },
            inputs: {
              system: "ユーザの問い合わせにある文章の専門家です。専門家として、ユーザのアイデアに対して実現可能なシナリオを100文字で書いてください。",
              prompt: "title `${:row.title}`\n description `${:row.description}`",
            },
            isResult: true,
          },
        },
      },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, agents);
  console.log(JSON.stringify(result, null, " "));
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
