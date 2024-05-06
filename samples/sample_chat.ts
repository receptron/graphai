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
    messages: {
      value: [],
      update: "reducer"
    },
    input: {
      agent: () => input({ message: "You:" }),
      isResult: true,
    },
    appendedMessages: {
      agent: (input: string, messages: Array<any>) => [...messages, {role: "user", content: input}],
      inputs: ["input", "messages"],
    },
    groq: {
      agent: "groqAgent",
      params: {
        model: "Llama3-8b-8192",
      },
      inputs: [undefined, "appendedMessages"],
    },
    output: {
      agent: (answer: string) => console.log(`Llama3: ${answer}\n`),
      inputs: ["groq.choices.$0.message.content"],
    },
    reducer: {
      // This node pushs the answer from Llama3 into the answer array.
      agent: "pushAgent",
      inputs: ["appendedMessages", "groq.choices.$0.message"],
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
