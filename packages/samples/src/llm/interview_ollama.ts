import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as llm_agents from "@graphai/llm_agents";
import * as agents from "@graphai/agents";

const system_interviewer =
  "You are a professional interviewer. It is your job to dig into the personality of the person, making some tough questions. In order to engage the audience, ask questions one by one, and respond to the answer before moving to the next topic.";

export const graph_data = {
  version: 0.5,
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
            name: "${name}",
            system: "You are ${name}.",
            greeting: "Hi, I'm ${name}",
          },
        },
      },
      inputs: { name: ":name" },
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
      inputs: { array: [[{ role: "system" }, { role: "user" }], ":context.person0.system", ":context.person1.greeting"] },
    },
    chat: {
      agent: "nestedAgent",
      inputs: { messages: ":messages", context: ":context" },
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
            inputs: { messages: ":messages" },
          },
          output: {
            // This node displays the responce to the user.
            agent: "stringTemplateAgent",
            params: {
              template: "\x1b[32m${name}:\x1b[0m ${message}\n",
            },
            console: {
              after: true,
            },
            inputs: { message: ":llm.choices.$0.message.content", name: ":context.person0.name" },
          },
          reducer: {
            // This node append the responce to the messages.
            agent: "pushAgent",
            inputs: { array: ":messages", item: ":llm.choices.$0.message" },
          },
          swappedContext: {
            agent: "propertyFilterAgent",
            params: {
              swap: {
                person0: "person1",
              },
            },
            inputs: { item: ":context" },
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
            inputs: { array: [":reducer.array", ":swappedContext.person0.system"] },
          },
        },
      },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner<{ messages: { role: string; content: string }[] }>(
    __dirname + "/../",
    __filename,
    graph_data,
    { ...agents, ...llm_agents },
    () => {},
    false,
  );
  if (result?.chat) {
    console.log("Complete", result.chat.messages.length);
  }
};

if (process.argv[1] === __filename) {
  main();
}
