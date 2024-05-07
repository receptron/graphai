import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, shiftAgent, nestedAgent } from "@/experimental_agents";
import input from "@inquirer/input";

const tools = [{
  type: "function",
  function: {
    name: "categorize",
    description: "categorize the food",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "The category of the food item.",
          values: [
            "fruit",
            "vegetable",
            "other"
          ]
        }
      },
      required: ["category"]
    },
  },
}];

const tools_baseball = [{
  "type": "function",
  "function": {
    "name": "get_game_score",
    "description": "Get the score for a given NBA game",
    "parameters": {
      "type": "object",
      "properties": {
        "team_name": {
          "type": "string",
          "description": "The name of the NBA team (e.g. 'Golden State Warriors')",
        }
      },
      "required": ["team_name"],
    },
  },
}]

const graph_data = {
  version: 0.2,
  nodes: {
    question: {
      value: ["apple", "eggplant"],
      // value: ["What was the score of the Warriors game?"],
    },
    groq: {
      // This node sends those messages to Llama3 on groq to get the answer.
      agent: "groqAgent",
      params: {
        model: "Llama3-8b-8192", // "llama3-70b-8192", // "Llama3-8b-8192",
        system: "You are a function calling LLM that categorize the specified food by calling categorize function.",
        // system: "You are a function calling LLM that uses the data extracted from the get_game_score function to answer questions around NBA game scores. Include the team and their opponent in your response.",
        tools,
        //tool_choice: {type: "function", function: {name:"categorize"}},
        verbose: true,
      },
      inputs: ["question.$1"],
    },
    output: {
      agent: (message:any) => console.log(JSON.stringify(message, null, 2)),
      inputs: ["groq.choices.$0.message"],
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(
    __filename,
    graph_data,
    {
      groqAgent,
      shiftAgent,
      nestedAgent,
    },
    () => {},
    false,
  );
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
