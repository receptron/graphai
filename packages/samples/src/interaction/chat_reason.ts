import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

// Based on https://github.com/bklieger-groq/g1
export const graph_data = {
  version: 0.5,
  nodes: {
    userInput: {
      // Sample questions:
      // - How many Rs are in strawberry?
      // - Which is larger, .9 or .11?
      agent: "textInputAgent",
      params: {
        message: "Question:",
      },
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
          while: ":continue",
        },
        nodes: {
          messages: {
            value: [],
            update: ":updatedMessages",
          },
          continue: {
            value: true,
            update: ":evaluator.continue"
          },
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
          message: {
            agent: "copyAgent",
            inputs: {
              "role": "assistant",
              "content": ":llm.text"
            }
          },
          updatedMessages: {
            agent: "pushAgent",
            inputs: {
              array: ":messages",
              item: ":message",
            }
          },
          parser: {
            agent: "jsonParserAgent",
            inputs: {
              text: ":llm.text"
            }
          },
          output: {
            agent: "stringTemplateAgent",
            console: {
              after: true,
            },
            params: { template: "\n[${title}]\n${content}" },
            inputs: {
              title: ":parser.title",
              content: ":parser.content"
            }
          },
          hack: {
            agent: "pushAgent",
            inputs: {
              array: [{}],
              item: ":parser.next_action"
            }
          },
          evaluator: {
            agent: "propertyFilterAgent",
            inputs: { 
              array: ":hack" 
            },
            params: {
              inspect: [
                { propId: "continue", equal: "continue", from: 1 },
              ],
            },
            // params: { inpect: [{ propId: "continue", equal: "continue", from: 1 }] },
          }
        }
      }
    }    
  }
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { ...agents }, () => {}, false);
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
