import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as llm_agents from "@/index";
import * as agents from "@graphai/agents";

const system_interviewer =
  "You are a professional interviewer. It is your job to dig into the personality of the person, making some tough questions. In order to engage the audience, ask questions one by one, and respond to the answer before moving to the next topic.";

export const graph_data = {
  version: 0.5,
  nodes: {
    name: {
      // Asks the user to enter the name of the person to interview.
      agent: "textInputAgent",
      params: {
        message: "インタビューしたい人の名前を入力してください:",
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
            name: "${name}",
            system: "You are ${name}.",
            greeting: "Hi, I'm ${name}",
          },
        },
      },
      inputs: { name: ":name" },
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
      inputs: { array: [[{ role: "system" }, { role: "user" }], ":context.person0.system", ":context.person1.greeting"] },
    },

    chat: {
      // performs the conversation using nested graph
      agent: "nestedAgent",
      inputs: { messages: ":messages", context: ":context" },
      isResult: true,
      graph: {
        loop: {
          count: 6,
        },
        nodes: {
          messages: {
            // Holds the conversation, array of messages.
            value: [], // to be filled with inputs[2]
            update: ":swappedMessages",
            isResult: true,
          },
          context: {
            // Holds the context, which is swapped for each iteration.
            value: {}, // te be mfilled with inputs[1]
            update: ":swappedContext",
          },
          groq: {
            // Sends those messages to the LLM to get a response.
            agent: "openAIAgent",
            params: {
              model: "gpt-4o",
            },
            inputs: { messages: ":messages" },
          },
          translate: {
            // Asks the LLM to translate it into Japanese.
            agent: "openAIAgent",
            params: {
              system: "この文章を日本語に訳して。意訳でも良いので、出来るだけ自然に相手に敬意を払う言葉遣いで。余計なことは書かずに、翻訳の結果だけ返して。",
              model: "gpt-4o",
            },
            inputs: { prompt: ":messages.$last.content" },
          },
          output: {
            // Displays the response to the user.
            agent: "stringTemplateAgent",
            params: {
              template: "\x1b[32m${name}:\x1b[0m ${message}\n",
            },
            console: {
              after: true,
            },
            inputs: { message: ":translate.choices.$0.message.content", name: ":context.person1.name" },
          },
          reducer: {
            // Append the responce to the messages.
            agent: "pushAgent",
            inputs: { array: ":messages", item: ":groq.choices.$0.message" },
          },
          swappedContext: {
            // Swaps the context
            agent: "propertyFilterAgent",
            params: {
              swap: {
                person0: "person1",
              },
            },
            inputs: { item: ":context" },
            isResult: true,
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
            inputs: { array: [":reducer", ":swappedContext.person0.system"] },
            isResult: true,
          },
        },
      },
    },
    translate: {
      // This node sends those messages to Llama3 on groq to get the answer.
      agent: "openAIAgent",
      params: {
        system: "この文章を日本語に訳して。出来るだけ自然な口語に。余計なことは書かずに、翻訳の結果だけ返して。",
      },
      inputs: { prompt: ":chat.swappedMessages.$last.content" },
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
      inputs: { message: ":translate.choices.$0.message.content", name: ":chat.swappedContext.person1.name" },
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
    console.log("Complete", result.chat["messages"].length);
  }
};

if (process.argv[1] === __filename) {
  main();
}
