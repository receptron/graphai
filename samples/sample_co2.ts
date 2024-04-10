import { GraphAI, AgentFunction } from "@/graphai";
import { readGraphaiData } from "~/utils/file_utils";

import { slashGPTAgent, slashGPTFuncitons2TextAgent } from "./agents/slashgpt_agent";
import { parrotingAgent } from "./agents/parroting_agent";

const graph_data = {
  nodes: {
    slashGPTAgent: {
      agentId: "slashGPTAgent",
      params: {
        function_result: true,
        prompt: "世界で協力してco2を減らす方法を教えて下さい",
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
      inputs: ["slashGPTAgent"],
      payloadMapping: {
        slashGPTAgent: "inputData",
      },
      agentId: "slashGPTFuncitons2TextAgent",
    },
    slashGPTAgent0: {
      agentId: "slashGPTAgent",
      params: {
        manifest: {
          prompt: "ユーザの問い合わせにある文章の専門家です。専門家として、ユーザのアイデアに対して実現可能なシナリオを800文字で書いてください。",
        },
      },
      payloadMapping: {
        function2prompt0: "inputData",
      },
      inputs: ["function2prompt0"],
    },
    // 1
    function2prompt1: {
      params: {
        function_data_key: "methods",
        result_key: 1,
      },
      inputs: ["slashGPTAgent"],
      payloadMapping: {
        slashGPTAgent: "inputData",
      },
      agentId: "slashGPTFuncitons2TextAgent",
    },
    slashGPTAgent1: {
      agentId: "slashGPTAgent",
      params: {
        manifest: {
          prompt: "ユーザの問い合わせにある文章の専門家です。専門家として、ユーザのアイデアに対して実現可能なシナリオを800文字で書いてください。",
        },
      },
      payloadMapping: {
        function2prompt1: "inputData",
      },
      inputs: ["function2prompt1"],
    },
  },
};
const runAgent = async () => {
  const graph = new GraphAI(graph_data, { default: parrotingAgent, slashGPTAgent, slashGPTFuncitons2TextAgent });
  const result = await graph.run();
  console.log(result);
};

const main = async () => {
  await runAgent();
  console.log("COMPLETE 1");
};
main();
