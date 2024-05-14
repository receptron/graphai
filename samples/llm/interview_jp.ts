import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, shiftAgent, nestedAgent, openAIAgent, propertyFilterAgent } from "@/experimental_agents";
import input from "@inquirer/input";

const system_interviewer =
  "You are a professional interviewer. It is your job to dig into the personality of the person, making some tough questions. In order to engage the audience, ask questions one by one, and respond to the answer before moving to the next topic.";

const graph_data = {
  version: 0.3,
  nodes: {
    name: {
      agent: () => input({ message: "インタビューしたい人の名前を入力してください:" }),
    },
    target: {
      agent: (name: string) => ({
        system: `You are ${name}.`,
      }),
      inputs: [":name"],
    },

    context: {
      agent: (name: string) => ({
        person0: {
          name: "Interviewer",
          system: system_interviewer,
        },
        person1: {
          name: `${name}`,
          system: `You are ${name}.`,
          greeting: `Hi, I'm ${name}`,
        },
      }),
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
      inputs: [":name", ":target.system", ":messages", ":context"],
      params: {
        injectionTo: ["name", "system", "messages"],
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
            agent: (answer: string, content: string, name: string, system_target: string) =>
              console.log(`\x1b[31m${content !== system_target ? name : "司会"}:\x1b[0m ${answer}\n`),
            inputs: [":translate.choices.$0.message.content", ":messages.$0.content", ":name", ":system"],
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
          },
          swappedMessages: {
            agent: (messages: Array<Record<string, string>>, system_target: string) => {
              return messages.map((message, index) => {
                const { role, content } = message;
                if (index === 0) {
                  if (content === system_target) {
                    return { role, content: system_interviewer };
                  } else {
                    return { role, content: system_target };
                  }
                }
                if (role === "user") {
                  return { role: "assistant", content };
                } else {
                  return { role: "user", content };
                }
              });
            },
            inputs: [":reducer", ":system"],
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
      agent: (answer: string, content: string, name: string, system_target: string) =>
        console.log(`\x1b[31m${content !== system_target ? name : "Interviewer"}:\x1b[0m ${answer}\n`),
      inputs: [":translate.choices.$0.message.content", ":chat.swappedMessages.$0.content", ":name", ":target.system"],
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
    },
    () => {},
    false,
  )) as any;
  console.log("Complete", result.chat["messages"].length);
};

if (process.argv[1] === __filename) {
  main();
}
