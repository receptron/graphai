import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as llm_agents from "@graphai/llm_agents";
import * as agents from "@graphai/agents";

const tools = [
  {
    type: "function",
    function: {
      name: "report",
      description: "Report the information acquired from the user",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "the name of the patient (first and last)",
          },
          sex: {
            type: "string",
            description: "Gender of the patient.",
            enum: ["male", "female"],
          },
          dob: {
            type: "string",
            description: "Patient's date of birth.",
          },
        },
        required: ["name", "sex", "dob"],
      },
    },
  },
];

export const graph_data = {
  version: 0.5,
  loop: {
    while: ":continue",
  },
  nodes: {
    // Holds a boolean value, which specifies if we need to contine or not.
    continue: {
      value: true,
      update: ":llm.choices.$0.message.content",
    },
    information: {
      // Holds the information acquired from the user at the end of this chat.
      value: {},
      update: ":argumentsParser",
      isResult: true,
    },
    messages: {
      // Holds the conversation, the array of messages.
      value: [
        {
          role: "system",
          content:
            "You  are responsible in retrieving following information from the user.\n" +
            "name: both first and last name\n" +
            "dob: date of birth. It MUST include the year\n" +
            "sex: gender (NEVER guess from the name)\n" +
            "When you get all the information from the user, call the function 'report'.\n",
        },
      ],
      update: ":reducer.array",
    },
    userInput: {
      // Receives an input from the user.
      agent: "textInputAgent",
      params: {
        message: "You:",
      },
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
      inputs: { array: [{ role: "user" }, ":userInput"] },
    },
    appendedMessages: {
      // Appends it to the conversation
      agent: "pushAgent",
      inputs: { array: ":messages", item: ":userMessage" },
    },
    llm: {
      // Sends those messages to LLM to get a response.
      agent: "geminiAgent",
      params: {
        tools,
      },
      inputs: { messages: ":appendedMessages.array" },
    },
    argumentsParser: {
      // Parses the function arguments
      agent: "jsonParserAgent",
      inputs: { text: [":llm.choices.$0.message.tool_calls.$0.function.arguments"] },
      if: ":llm.choices.$0.message.tool_calls",
    },
    output: {
      // Displays the response to the user.
      agent: "stringTemplateAgent",
      params: {
        template: "\x1b[32mLlama3\x1b[0m: ${message}",
      },
      console: {
        after: true,
      },
      inputs: { message: ":llm.choices.$0.message.content" },
      if: ":llm.choices.$0.message.content",
    },
    reducer: {
      // Appends the responce to the messages.
      agent: "pushAgent",
      inputs: { array: ":appendedMessages.array", item: ":llm.choices.$0.message" },
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
