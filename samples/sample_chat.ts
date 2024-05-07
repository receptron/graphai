import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, shiftAgent, nestedAgent } from "@/experimental_agents";
import input from "@inquirer/input";

const graph_data = {
  version: 0.2,
  loop: {
    while: "continue",
  },
  nodes: {
    continue: {
      value: true,
      update: "checkInput",
    },
    messages: {
      // This node holds the conversation, array of messages.
      value: [],
      update: "reducer",
      isResult: true,
    },
    userInput: {
      // This node receives an input from the user.
      agent: () => input({ message: "You:" }),
    },
    checkInput: {
      agent: (query: string) => query !== "/bye",
      inputs: ["userInput"],
    },
    appendedMessages: {
      // This node appends the user's input to the array of messages.
      agent: (content: string, messages: Array<any>) => [...messages, { role: "user", content }],
      inputs: ["userInput", "messages"],
      if: "checkInput",
    },
    groq: {
      // This node sends those messages to Llama3 on groq to get the answer.
      agent: "groqAgent",
      params: {
        model: "Llama3-8b-8192",
      },
      inputs: [undefined, "appendedMessages"],
    },
    output: {
      // This node displays the responce to the user.
      agent: (answer: string) => console.log(`Llama3: ${answer}\n`),
      inputs: ["groq.choices.$0.message.content"],
    },
    reducer: {
      // This node append the responce to the messages.
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
