import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
// import * as llm_agents from "@/index";
import * as agents from "@graphai/agents";

export const graph_data = {
  version: 0.5,
  nodes: {
    userInput: {
      value: "How may 'r' in strawberry?"
      /*
      // Receives an input from the user.
      agent: "textInputAgent",
      params: {
        message: "Question:",
      },
      */
    },
    userMessage: {
      agent: "propertyFilterAgent",
      inputs: { 
        array: [
          {
            role: "user",
          },
          ":userInput"
        ] 
      },
      params: { inject: [{ propId: "content", from: 1 }] },
    },
    messages: {
      agent: "pushAgent",
      inputs: {
        array: [],
        items: [
          {
            role: "system",
            content: `
              You are an expert AI assistant that explains your reasoning step by step. 
              For each step, provide a title that describes what you're doing in that step, along with the content. 
              Decide if you need another step or if you're ready to give the final answer. 
              Respond in JSON format with 'title', 'content', and 'next_action' (either 'continue' or 'final_answer') keys. 
              USE AS MANY REASONING STEPS AS POSSIBLE. AT LEAST 3. BE AWARE OF YOUR LIMITATIONS AS AN LLM AND WHAT YOU CAN AND CANNOT DO. 
              IN YOUR REASONING, INCLUDE EXPLORATION OF ALTERNATIVE ANSWERS. CONSIDER YOU MAY BE WRONG, AND IF YOU ARE WRONG IN YOUR REASONING, 
              WHERE IT WOULD BE. FULLY TEST ALL OTHER POSSIBILITIES. YOU CAN BE WRONG. WHEN YOU SAY YOU ARE RE-EXAMINING, ACTUALLY RE-EXAMINE, 
              AND USE ANOTHER APPROACH TO DO SO. DO NOT JUST SAY YOU ARE RE-EXAMINING. USE AT LEAST 3 METHODS TO DERIVE THE ANSWER. 
              USE BEST PRACTICES.
              
              Example of a valid JSON response:
              {
                "title": "Identifying Key Information",
                "content": "To begin solving this problem, we need to carefully examine the given information and identify the crucial elements that will guide our solution process. This involves...",
                "next_action": "continue"
              }
            `
          },
          ":userMessage",
          {
            role: "assistant",
            content: "Thank you! I will now think step by step following my instructions, starting at the beginning after decomposing the problem."
          }
        ]
      }
    },
    subGraph: {
      agent: "nestedAgent",
      inputs: {
        messages: ":messages"
      },
      graph: {
        loop: {
          count: 1,
        },
        nodes: {
          llm: {
            // Sends those messages to LLM to get a response.
            agent: "openAIAgent",
            params: {
              response_format: {
                type: "json_object"
              },
            },
            inputs: { messages: ":messages" },
          },
          parser: {
            agent: "jsonParserAgent",
            console: {
              after: true,
            },
            inputs: {
              text: ":llm.text"
            }
          },
        }
      }
    }    
  }

  /*
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
      value: messages,
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
      inputs: { array: [{}, ":userInput"] },
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
      agent: "groqAgent",
      params: {
        model: "Llama3-8b-8192",
      },
      inputs: { messages: ":appendedMessages" },
    },
    output: {
      // Displays the response to the user.
      agent: "stringTemplateAgent",
      params: {
        template: "\x1b[32mAgent\x1b[0m: ${message}",
      },
      console: {
        after: true,
      },
      inputs: { message: ":llm.choices.$0.message.content" },
    },
    reducer: {
      // Appends the responce to the messages.
      agent: "pushAgent",
      inputs: { array: ":appendedMessages", item: ":llm.choices.$0.message" },
    },
  },
  */
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { ...agents }, () => {}, false);
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
