import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, mapAgent, copyAgent } from "@/experimental_agents";

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
            "meat",
            "other"
          ]
        }
      },
      required: ["category"]
    },
  },
}];

const graph_data = {
  version: 0.2,
  concurrency: 2,
  nodes: {
    foods: {
      value: ["apple", "eggplant", "pork"],
    },
    categorizer: {
      agent: "mapAgent",
      inputs: ["foods"],
      isResult: true,
      graph: {
        version: 0.2,
        nodes: {
          debug: {
            agent: (food:string) => console.log(food),
            inputs: ["$0"],
            isResult: true,
          },          
          groq: {
            // This node sends those messages to Llama3 on groq to get the answer.
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192", // "llama3-70b-8192", // "Llama3-8b-8192",
              system: "You are a function calling LLM that categorize the specified food by calling categorize function.",
              tools,
              tool_choice: {type: "function", function: {name:"categorize"}},
            },
            retry: 1,
            inputs: ["$0"],
          },
          output: {
            agent: "copyAgent",
            inputs: ["groq.choices.$0.message.tool_calls.$0.function.arguments"],
            isResult: true,
          },
          debug2: {
            agent: (args:any) => console.log(args),
            inputs: ["groq.choices.$0.message.tool_calls.$0.function.arguments"],
          },
        }
      }
    }
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(
    __filename,
    graph_data,
    {
      groqAgent,
      copyAgent,
      mapAgent,
    },
    () => {},
    false,
  );
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
