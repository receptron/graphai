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
          type: "enum",
          description: "The category of the food item.",
          values: [
            "fruit",
            "vegetable",
            "other"
          ]
        }
      },
      required: "category"
    },
  },
}];

const graph_data = {
  version: 0.2,
  nodes: {
    question: {
      value: ["apple", "eggplant"],
    },
    groq: {
      // This node sends those messages to Llama3 on groq to get the answer.
      agent: "groqAgent",
      params: {
        model: "Llama3-8b-8192",
        system: "Please tell the category of the item, either fruit or vegitable.",
        tools
      },
      inputs: ["question.$0"],
    },
    output: {
      agent: (message:any) => console.log(message),
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
