import "dotenv/config";

import { graph_data as graph_data_wearther } from "../net/weather";

import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

const photoGraph = {
  version: 0.5,
  loop: {
    while: ":checkInput",
  },
  nodes: {
    userInput: {
      // Asks the user to enter the name of the person to interview.
      agent: "textInputAgent",
      params: {
        message: "写真を見るループ",
      },
    },
    checkInput: {
      // Checks if the user wants to terminate the chat or not.
      agent: "compareAgent",
      inputs: { array: [":userInput.text", "!=", "/bye"] },
      console: { after: true },
    },
  },
};

const workflowList = [
  { name: "weather", description: "今日の天気を知る" },
  { name: "photo", description: "今日のすすめ写真を取得" },
];

const workflowGraphs: Record<string, unknown> = {
  weather: graph_data_wearther,
  photo: photoGraph,
};

const tools = [
  {
    type: "function",
    function: {
      name: "getWorkflow",
      description: "get workflow name from List",
      parameters: {
        type: "object",
        properties: {
          workflow_name: {
            type: "string",
            description: "workflow name.",
          },
        },
        required: ["workflow_name"],
      },
    },
  },
];

const graph_data = {
  version: 0.5,
  loop: {
    while: ":checkInput",
  },
  nodes: {
    userInput: {
      // Asks the user to enter the name of the person to interview.
      agent: "textInputAgent",
      params: {
        message: "何をしたいですか？",
      },
    },
    checkInput: {
      // Checks if the user wants to terminate the chat or not.
      agent: "compareAgent",
      inputs: { array: [":userInput.text", "!=", "/bye"] },
    },
    llm: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        tools,
      },
      // inputs: { messages: ":messages" },
      inputs: {
        system: `あなたはワークフローを制御いています。ユーザからの入力をもとに、ふさわしいワークフローが見つかれば、その名前を返してください。\n\n一覧\n${JSON.stringify(workflowList, null, 2)}`,
        prompt: ":userInput.text",
      },
    },
    debug: {
      agent: "copyAgent",
      inputs: { tools: ":llm.tool", text: ":llm.text" },
    },
    workflow: {
      agent: (namedInputs: { workflow_name: string }) => {
        const { workflow_name } = namedInputs;
        const workFlow = workflowGraphs[workflow_name as string];
        return {
          graph: workFlow,
        };
      },
      inputs: { workflow_name: ":llm.tool.arguments.workflow_name" },
    },
    workflowGraph: {
      agent: "nestedAgent",
      graph: ":workflow.graph",
      if: ":workflow.graph",
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, agents);
  console.log(result.result);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
