import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { interactiveInputTextAgent } from "./agents/interactiveInputAgent";
import { groqAgent, fetchAgent, shiftAgent, nestedAgent } from "@/experimental_agents";
import input from "@inquirer/input";

const graph_data = {
  version: 0.2,
  loop: {
    while: "continue",
  },
  nodes: {
    continue: {
      value: true,
    },
    input: {
      agent: () => input({ message: "You:" }),
      isResult: true,
    },
    groq: {
      agent: "groqAgent",
      params: {
        model: "Llama3-8b-8192",
      },
      inputs: ["input"],
    },
    output: {
      agent: (answer: string) => console.log(`Llama3: ${answer}\n`),
      inputs: ["groq.choices.$0.message.content"],
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
      fetchAgent,
      nestedAgent,
      interactiveInputTextAgent,
    },
    () => {},
    false,
  );
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
