import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { openAIAgent, shiftAgent, nestedAgent, propertyFilterAgent, stringTemplateAgent, textInputAgent } from "@/experimental_agents";

const system_interviewer =
  "You are a professional interviewer. It is your job to dig into the personality of the person, making some tough questions. In order to engage the audience, ask questions one by one, and respond to the answer before moving to the next topic.";

export const graph_data = {
  version: 0.3,
  nodes: {
    name: {
      agent: "textInputAgent",
      params: {
        message: "Name of a famous person you want to interview:",
      },
    },
    context: {
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
            // This node holds the conversation, array of messages.
            value: [], // to be filled with inputs[0]
            update: ":swappedMessages",
            isResult: true,
          },
          context: {
            value: {}, // te be mfilled with inputs[1]
            update: ":swappedContext",
          },
          llm: {
            // This node sends those messages to the llm to get the answer.
            agent: "openAIAgent",
            params: {
              model: "llama3",
              baseURL: "http://127.0.0.1:11434/v1",
              apiKey: "ollama",
            },
            inputs: [undefined, ":messages"],
          },
          output: {
            // This node displays the responce to the user.
            agent: "stringTemplateAgent",
            params: {
              template: "\x1b[32m${1}:\x1b[0m ${0}\n",
            },
            console: {
              after: true,
            },
            inputs: [":llm.choices.$0.message.content", ":context.person0.name"],
          },
          reducer: {
            // This node append the responce to the messages.
            agent: "pushAgent",
            inputs: [":messages", ":llm.choices.$0.message"],
          },
          swappedContext: {
            agent: "propertyFilterAgent",
            params: {
              swap: {
                person0: "person1",
              },
            },
            inputs: [":context"],
          },
          swappedMessages: {
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
  const result = (await graphDataTestRunner(
    __filename,
    graph_data,
    {
      openAIAgent,
      shiftAgent,
      nestedAgent,
      propertyFilterAgent,
      stringTemplateAgent,
      textInputAgent,
    },
    () => {},
    false,
  )) as any;
  console.log("Complete", result.chat.messages.length);
};

if (process.argv[1] === __filename) {
  main();
}
