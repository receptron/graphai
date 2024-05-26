import "dotenv/config";

import { slashGPTFuncitons2TextAgent } from "../utils/agents/slashgpt_agent";
import { slashGPTAgent } from "@graphai/agents";
import { agentInfoWrapper } from "graphai/lib/utils/utils";

import { graphDataTestRunner } from "@/utils/test_runner";

const graph_data = {
  verbose: true,
  nodes: {
    slashGPTAgent: {
      agent: "slashGPTAgent",
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
      params: {
        function_data_key: "methods",
        result_key: 0,
      },
      inputs: [":slashGPTAgent"],
      agent: "slashGPTFuncitons2TextAgent",
    },
    mapNode: {
      agent: "mapAgent",
      inputs: [":function2prompt0"],
      params: {
        namedInputs: ["memory"],
      },
      graph: {
        nodes: {
          memory: {
            value: {},
          },
          slashGPTAgent0: {
            agent: "slashGPTAgent",
            params: {
              manifest: {
                prompt: "ユーザの問い合わせにある文章の専門家です。専門家として、ユーザのアイデアに対して実現可能なシナリオを100文字で書いてください。",
              },
            },
            isResult: true,
            inputs: [":memory"],
          },
        },
      },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, {
    slashGPTAgent,
    slashGPTFuncitons2TextAgent: agentInfoWrapper(slashGPTFuncitons2TextAgent),
  });
  console.log(JSON.stringify(result, null, "  "));
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
