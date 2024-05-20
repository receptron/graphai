import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, shiftAgent, nestedAgent, textInputAgent, propertyFilterAgent } from "@/experimental_agents";
import input from "@inquirer/input";

const graph_data = {
  version: 0.3,
  loop: {
    while: ":continue",
  },
  nodes: {
    continue: {
      value: true,
      update: ":checkInput.continue",
    },
    messages: {
      // This node holds the conversation, array of messages.
      value: [],
      update: ":reducer",
      isResult: true,
    },
    userInput: {
      agent: "textInputAgent",
      params: {
        message: "You:",
      },
    },
    checkInput: {
      agent: "propertyFilterAgent",
      params: {
        inspect: [
          {
            propId: "continue",
            notEqual: "/bye",
          },
        ],
      },
      inputs: [{}, ":userInput"],
    },
    appendedMessages: {
      // This node appends the user's input to the array of messages.
      agent: (content: string, messages: Array<any>) => [...messages, { role: "user", content }],
      inputs: [":userInput", ":messages"],
      if: ":checkInput",
    },
    groq: {
      // This node sends those messages to Llama3 on groq to get the answer.
      agent: "groqAgent",
      params: {
        model: "Llama3-8b-8192",
      },
      inputs: [undefined, ":appendedMessages"],
    },
    output: {
      // This node displays the responce to the user.
      agent: (answer: string) => console.log(`Llama3: ${answer}\n`),
      inputs: [":groq.choices.$0.message.content"],
    },
    reducer: {
      // This node append the responce to the messages.
      agent: "pushAgent",
      inputs: [":appendedMessages", ":groq.choices.$0.message"],
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
      textInputAgent,
      propertyFilterAgent,
    },
    () => {},
    false,
  );
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
