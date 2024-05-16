import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, shiftAgent, nestedAgent, openAIAgent, stringTemplateAgent, propertyFilterAgent, textInputAgent } from "@/experimental_agents";

const system_interviewer =
  "You are a professional interviewer. It is your job to dig into the personality of the person, making some tough questions. In order to engage the audience, ask questions one by one, and respond to the answer before moving to the next topic.";

const graph_data = {
  version: 0.3,
  nodes: {
    name: {
      agent: "textInputAgent",
      params: {
        message: "インタビューしたい人の名前を入力してください:",
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
        }
      },
      inputs: [":name"],
    },
    messages: {
      agent: "propertyFilterAgent",
      params: {
        inject: [{
          index: 0,
          propId: "content",
          from: 1,
        },{
          index: 1,
          propId: "content",
          from: 2,
        }],
      },
      inputs: [[{ role:"system" }, { role:"user" }], ":context.person0.system", ":context.person1.greeting"],
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
            value: [], // to be filled with inputs[2]
            update: ":swappedMessages",
            isResult: true,
          },
          context: {
            value: {}, // te be mfilled with inputs[1]
            update: ":swappedContext",
          },
          groq: {
            // This node sends those messages to Llama3 on groq to get the answer.
            agent: "openAIAgent",
            //agent: "groqAgent",
            params: {
              //model: "Llama3-8b-8192",
              model: "gpt-4o",
            },
            inputs: [undefined, ":messages"],
          },
          translate: {
            // This node sends those messages to Llama3 on groq to get the answer.
            agent: "openAIAgent",
            params: {
              system: "この文章を日本語に訳して。意訳でも良いので、出来るだけ自然に相手に敬意を払う言葉遣いで。余計なことは書かずに、翻訳の結果だけ返して。",
              model: "gpt-4o",
            },
            inputs: [":messages.$last.content"],
          },
          output: {
            // This node displays the responce to the user.
            agent: "stringTemplateAgent",
            params: {
              template: "\x1b[32m${1}:\x1b[0m ${0}\n"
            },
            console: {
              after: true,
            },
            inputs: [":translate.choices.$0.message.content", ":context.person1.name"],
          },
          reducer: {
            // This node append the responce to the messages.
            agent: "pushAgent",
            inputs: [":messages", ":groq.choices.$0.message"],
          },
          swappedContext: {
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
            agent: "propertyFilterAgent",
            params: {
              inject: [{
                propId: "content",
                index: 0,
                from: 1,
              }],
              alter: {
                role: {
                  assistant: "user",
                  user: "assistant",
                }
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
        template: "\x1b[32m${1}:\x1b[0m ${0}\n"
      },
      console: {
        after: true,
      },
      inputs: [":translate.choices.$0.message.content", ":chat.swappedContext.person1.name"],
    },
  },
};

export const main = async () => {
  const result = (await graphDataTestRunner(
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
  )) as any;
  console.log("Complete", result.chat["messages"].length);
};

if (process.argv[1] === __filename) {
  main();
}
