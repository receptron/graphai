import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, shiftAgent, nestedAgent } from "@/experimental_agents";
import input from "@inquirer/input";


const system_interviewer = "You are a professional interviewer. It is your job to dig into the personality of the person, making some tough questions. In order to engage the audience, ask questions one by one, and respond to the answer before moving to the next topic.";

const graph_data = {
  version: 0.3,
  nodes: {
    name: {
      agent: () => input({ message: "Name of a famous person you want to interview:" }),
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
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192",
            },
            inputs: [undefined, ":$2"],
          },
          output: {
            // This node displays the responce to the user.
            agent: (answer: string, content: string, name: string, system_target: string) => 
              console.log(`\x1b[31m${ content === system_target ? name : "Interviewer" }:\x1b[0m ${answer}\n`),
            inputs: [":groq.choices.$0.message.content", ":$2.$0.content", ":$0", ":$1"],
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
                    return { role, content: system_interviewer}
                  } else {
                    return { role, content: system_target}
                  }
                }
                if (role === "user") {
                  return { role: "assistant", content };
                } else {
                  return { role: "user", content };
                }
              });
            },
            inputs: [":reducer", ":$1"]
          },
        },
      }
    }
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
    },
    () => {},
    false,
  );
  console.log("Complete");
};

if (process.argv[1] === __filename) {
  main();
}

