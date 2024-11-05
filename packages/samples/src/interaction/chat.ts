import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as llm_agents from "@graphai/llm_agents";
import * as agents from "@graphai/agents";

export const graph_data = {
  version: 0.5,
  loop: {
    while: ":continue",
  },
  nodes: {
    // Holds a boolean value, which specifies if we need to contine or not.
    continue: {
      value: true,
      update: ":checkInput",
    },
    messages: {
      // Holds the conversation, the array of messages.
      value: [],
      update: ":llm.messages",
      isResult: true,
    },
    userInput: {
      // Receives an input from the user.
      agent: "textInputAgent",
      params: {
        message: "You:",
        required: true,
      },
    },
    checkInput: {
      // Checks if the user wants to terminate the chat or not.
      agent: "compareAgent",
      inputs: { array: [":userInput.text", "!=", "/bye"] },
    },
    llm: {
      // Sends those messages to LLM to get a response.
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
      },
      inputs: { messages: ":messages", prompt: ":userInput.text" },
    },
    output: {
      // Displays the response to the user.
      agent: "stringTemplateAgent",
      console: {
        after: true,
      },
      inputs: {
        text: "\x1b[32mAgent\x1b[0m: ${:llm.text}",
      },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { ...agents, ...llm_agents }, () => {}, false);
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
