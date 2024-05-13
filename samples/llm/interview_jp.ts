import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, shiftAgent, nestedAgent, openAIAgent } from "@/experimental_agents/packages";
import input from "@inquirer/input";


const system_interviewer = "You are a professional interviewer. It is your job to dig into the personality of the person, making some tough questions. In order to engage the audience, ask questions one by one, and respond to the answer before moving to the next topic.";

const graph_data = {
  version: 0.3,
  nodes: {
    name: {
      agent: () => input({ message: "インタビューしたい人の名前を入力してください:" }),
    },
    target: {
      agent: (name: string) => ({
        system: `You are ${name}.`,
        messages: [
          { role: "system", content: system_interviewer },
          { role: "user", content: `Hi, I'm ${name}` }
        ],
      }),
      inputs: [":name"],   
    },
    chat: {
      agent: "nestedAgent",
      inputs: [":name", ":target.system", ":target.messages"],
      isResult: true,
      graph: {
        loop: {
          count: 6,
        },
        nodes: {
          $2: {
            // This node holds the conversation, array of messages.
            value: [], // to be filled with inputs[2]
            update: ":switcher",
            isResult: true,
          },
          groq: {
            // This node sends those messages to Llama3 on groq to get the answer.
            agent: "openAIAgent",
            //agent: "groqAgent",
            params: {
              //model: "Llama3-8b-8192",
              model: "gpt-4o",
            },
            inputs: [undefined, ":$2"],
          },
          translate: {
            // This node sends those messages to Llama3 on groq to get the answer.
            agent: "openAIAgent",
            params: {
              system: "この文章を日本語に訳して。意訳でも良いので、出来るだけ自然に相手に敬意を払う言葉遣いで。余計なことは書かずに、翻訳の結果だけ返して。",
              model: "gpt-4o",
            },
            inputs: [":$2.$last.content"],
          },
          output: {
            // This node displays the responce to the user.
            agent: (answer: string, content: string, name: string, system_target: string) => 
              console.log(`\x1b[31m${ content !== system_target ? name : "司会" }:\x1b[0m ${answer}\n`),
            inputs: [":translate.choices.$0.message.content", ":$2.$0.content", ":$0", ":$1"],
          },
          reducer: {
            // This node append the responce to the messages.
            agent: "pushAgent",
            inputs: [":$2", ":groq.choices.$0.message"],
          },
          switcher: {
            agent: (messages:Array<Record<string, string>>, system_target: string) => {
              return messages.map((message, index) => {
                const { role, content } = message;
                if (index === 0) {
                  if (content === system_target) {
                    return { role, content: system_interviewer};
                  } else {
                    return { role, content: system_target};
                  }
                }
                if (role === "user") {
                  return { role: "assistant", content };
                } else {
                  return { role: "user", content };
                }
              });
            },
            inputs: [":reducer", ":$1"],
            isResult: true,
          },
        },
      }
    },
    translate: {
      // This node sends those messages to Llama3 on groq to get the answer.
      agent: "openAIAgent",
      params: {
        system: "この文章を日本語に訳して。出来るだけ自然な口語に。余計なことは書かずに、翻訳の結果だけ返して。"
      },
      inputs: [":chat.switcher.$last.content"],
    },
    output: {
      // This node displays the responce to the user.
      agent: (answer: string, content: string, name: string, system_target: string) => 
        console.log(`\x1b[31m${ content !== system_target ? name : "Interviewer" }:\x1b[0m ${answer}\n`),
      inputs: [":translate.choices.$0.message.content", ":chat.switcher.$0.content", ":name", ":target.system"],
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(
    __filename,
    graph_data,
    {
      groqAgent,
      shiftAgent,
      nestedAgent,
      openAIAgent,
    },
    () => {},
    false,
  ) as any;
  console.log("Complete", result.chat["$2"].length);
};

if (process.argv[1] === __filename) {
  main();
}

