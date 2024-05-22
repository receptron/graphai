import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, shiftAgent, nestedAgent, propertyFilterAgent, stringTemplateAgent, textInputAgent } from "@/experimental_agents";

const system_interviewer =
  "You are a professional interviewer. It is your job to dig into the personality of the person, making some tough questions. In order to engage the audience, ask questions one by one, and respond to the answer before moving to the next topic.";

export const graph_data = {
  version: 0.3,
  nodes: {
    name: {
      // Asks the user to enter the name of the person to interview.
      agent: "textInputAgent",
      params: {
        message: "Name of a famous person you want to interview:",
      },
    },
    context: {
      // prepares the context for this interview.
      agent: "stringTemplateAgent",
      params: {
        template: {
          person0: {
            name: "Interviewer",
            system: system_interviewer,
          },
          person1: {
            name: "${0}",
            system: "You are ${0}.",
            greeting: "Hi, I'm ${0}",
          },
        },
      },
      inputs: [":name"],
    },
    messages: {
      // Prepares the conversation with one system message and one user message
      agent: "propertyFilterAgent",
      params: {
        inject: [
          {
            index: 0,
            propId: "content",
            from: 1,
          },
          {
            index: 1,
            propId: "content",
            from: 2,
          },
        ],
      },
      inputs: [[{ role: "system" }, { role: "user" }], ":context.person0.system", ":context.person1.greeting"],
    },
    chat: {
      // performs the conversation using nested graph
      agent: "nestedAgent",
      inputs: [":messages", ":context"],
      params: {
        namedInputs: ["messages", "context"],
      },
      isResult: true,
      graph: {
        loop: {
          count: 6,
        },
        nodes: {
          messages: {
            // Holds the conversation, array of messages.
            value: [], // filled with inputs[0]
            update: ":swappedMessages",
            isResult: true,
          },
          context: {
            // Holds the context, which is swapped for each iteration.
            value: {}, // filled with inputs[1]
            update: ":swappedContext",
          },
          groq: {
            // Sends those messages to the LLM to get a response.
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192",
            },
            inputs: [undefined, ":messages"],
          },
          output: {
            // Displays the response to the user.
            agent: "stringTemplateAgent",
            params: {
              template: "\x1b[32m${1}:\x1b[0m ${0}\n",
            },
            console: {
              after: true,
            },
            inputs: [":groq.choices.$0.message.content", ":context.person0.name"],
          },
          reducer: {
            // Appends the response to the messages.
            agent: "pushAgent",
            inputs: [":messages", ":groq.choices.$0.message"],
          },
          swappedContext: {
            // Swaps the context
            agent: "propertyFilterAgent",
            params: {
              swap: {
                person0: "person1",
              },
            },
            inputs: [":context"],
          },
          swappedMessages: {
            // Swaps the user and assistant of messages
            agent: "propertyFilterAgent",
            params: {
              inject: [
                {
                  propId: "content",
                  index: 0,
                  from: 1,
                },
              ],
              alter: {
                role: {
                  assistant: "user",
                  user: "assistant",
                },
              },
            },
            inputs: [":reducer", ":swappedContext.person0.system"],
          },
        },
      },
    },
  },
};

export const main = async () => {
  const result = (await graphDataTestRunner<{ messages: { role: string; content: string }[] }>(
    __filename,
    graph_data,
    {
      groqAgent,
      shiftAgent,
      nestedAgent,
      propertyFilterAgent,
      stringTemplateAgent,
      textInputAgent,
    },
    () => {},
    false,
  ));
  if (result?.chat) {
    console.log("Complete", result.chat.messages.length);
  }
};

if (process.argv[1] === __filename) {
  main();
}
