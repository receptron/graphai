import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, shiftAgent, nestedAgent, openAIAgent, stringTemplateAgent, propertyFilterAgent, textInputAgent } from "@/experimental_agents";

const system_interviewer =
  "You are a professional interviewer. It is your job to dig into the personality of the person, making some tough questions. In order to engage the audience, ask questions one by one, and respond to the answer before moving to the next topic.";

const graph_data = {
  version: 0.3,
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
            inputs: [undefined, ":messages"],
          },
          translate: {
            // Asks the LLM to translate it into Japanese.
            agent: "openAIAgent",
            params: {
              system: "この文章を日本語に訳して。意訳でも良いので、出来るだけ自然に相手に敬意を払う言葉遣いで。余計なことは書かずに、翻訳の結果だけ返して。",
              model: "gpt-4o",
            },
            inputs: [":messages.$last.content"],
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
            inputs: [":translate.choices.$0.message.content", ":context.person1.name"],
          },
          reducer: {
            // Append the responce to the messages.
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
            inputs: [":reducer", ":swappedContext.person0.system"],
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
      inputs: [":chat.swappedMessages.$last.content"],
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
      inputs: [":translate.choices.$0.message.content", ":chat.swappedContext.person1.name"],
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner<{ messages: { role: string; content: string }[] }>(
    __filename,
    graph_data,
    {
      groqAgent,
      shiftAgent,
      nestedAgent,
      openAIAgent,
      propertyFilterAgent,
      stringTemplateAgent,
      textInputAgent,
    },
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
