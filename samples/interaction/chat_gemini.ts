import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { geminiAgent, shiftAgent, nestedAgent, textInputAgent, propertyFilterAgent, stringTemplateAgent } from "@/experimental_agents";

export const graph_data = {
  version: 0.3,
  loop: {
    while: ":continue",
  },
  nodes: {
    // Holds a boolean value, which specifies if we need to contine or not.
    continue: {
      value: true,
      update: ":checkInput.continue",
    },
    messages: {
      // Holds the conversation, the array of messages.
      value: [],
      update: ":reducer",
      isResult: true,
    },
    userInput: {
      // Receives an input from the user.
      agent: "textInputAgent",
      params: {
        message: "You:",
      },
    },
    checkInput: {
      // Checks if the user wants to terminate the chat or not.
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
    userMessage: {
      // Generates an message object with the user input.
      agent: "propertyFilterAgent",
      params: {
        inject: [
          {
            propId: "content",
            from: 1,
          },
        ],
      },
      inputs: [{ role: "user" }, ":userInput"],
    },
    appendedMessages: {
      // Appends it to the conversation
      agent: "pushAgent",
      inputs: [":messages", ":userMessage"],
    },
    groq: {
      // Sends those messages to LLM to get a response.
      agent: "geminiAgent",
      inputs: [undefined, ":appendedMessages"],
    },
    output: {
      // Displays the response to the user.
      agent: "stringTemplateAgent",
      params: {
        template: "\x1b[32mLlama3\x1b[0m: ${0}",
      },
      console: {
        after: true,
      },
      inputs: [":groq.choices.$0.message.content"],
    },
    reducer: {
      // Appends the responce to the messages.
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
      geminiAgent,
      shiftAgent,
      nestedAgent,
      textInputAgent,
      propertyFilterAgent,
      stringTemplateAgent,
    },
    () => {},
    false,
  );
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
