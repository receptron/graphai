import "dotenv/config";

import { slashGPTFuncitons2TextAgent } from "./agents/slashgpt_agent";
import { slashGPTAgent } from "@/experimental_agents";

import { graphDataTestRunner } from "~/utils/runner";

const graph_data = {
  verbose: true,
  nodes: {
    slashGPTAgent: {
      agentId: "slashGPTAgent",
      params: {
        function_result: true,
        query: "世界で協力してco2を減らす方法を教えて下さい",
        manifest: {
          prompt: "あなたは世界経済の専門家です。ユーザの問い合わせについて考え、10この結果をfunctionsの結果に返してください。",
          skip_function_result: true,
          actions: {
            your_ideas: {
              type: "message_template",
              message: "dummy",
            },
          },
          functions: [
            {
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
              },
            },
          ],
        },
      },
    },
    function2prompt0: {
      fork: 10,
      params: {
        function_data_key: "methods",
        result_key: 0,
      },
      inputs: ["slashGPTAgent"],
      agentId: "slashGPTFuncitons2TextAgent",
    },
    slashGPTAgent0: {
      agentId: "slashGPTAgent",
      fork: 10,
      params: {
        manifest: {
          prompt: "ユーザの問い合わせにある文章の専門家です。専門家として、ユーザのアイデアに対して実現可能なシナリオを100文字で書いてください。",
        },
      },
      inputs: ["function2prompt0.content"],
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner("sample_co2.log", graph_data, { slashGPTAgent, slashGPTFuncitons2TextAgent });
  console.log(result);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
