import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, shiftAgent, nestedAgent } from "@/experimental_agents";
import input from "@inquirer/input";


const system_interviewer = "You are a professional interviewer. It is your job to dig into the personality of the person, making some tough questions. In order to engage the audience, ask questions one by one, and respond to the answer before moving to the next topic.";
const system_jobs = "You are Steve Jobs.";
const query = "Hi, I'm Steve Jobs.";

const graph_data = {
  version: 0.3,
  nodes: {
    name: {
      value: "Steve Jobs"
    },
    debugOutput: {
      agent: (foo: string) => console.log(foo),
      inputs: [":name"],
    },
    target: {
      agent: (name: string) => ({
        system: `You are ${name}`,
        /*
        content: `Hi, I'm ${name}`,
        messages: [
          { role: "system", content: system_interviewer },
          { role: "user", content: `Hi, I'm ${name}`}
        ],
        */
      }),
      inputs: [":name"],   
    },
    chat: {
      agent: "nestedAgent",
      inputs: [":name", ":target.system"],
      graph: {
        loop: {
          count: 2,
        },
        nodes: {
      
          messages: {
            // This node holds the conversation, array of messages.
            value: [
              { role: "system", content: system_interviewer },
              { role: "user", content: "Hi, I'm Steve Jobs" }
            ],
            update: ":switcher",
            isResult: true,
          },
          groq: {
            // This node sends those messages to Llama3 on groq to get the answer.
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192",
            },
            inputs: [undefined, ":messages"],
          },
          debugOutput: {
            agent: (foo: string) => console.log(foo),
            inputs: [":$0"],
          },

          output: {
            // This node displays the responce to the user.
            agent: (answer: string, content: string, name: string) => 
              console.log(`${ content === system_jobs ? name : "Interviewer" }: ${answer}\n`),
            inputs: [":groq.choices.$0.message.content", ":messages.$0.content", ":$0"],
          },
          reducer: {
            // This node append the responce to the messages.
            agent: "pushAgent",
            inputs: [":messages", ":groq.choices.$0.message"],
          },
          switcher: {
            agent: (messages:Array<Record<string, string>>) => {
              return messages.map((message, index) => {
                const { role, content } = message;
                if (index === 0) {
                  if (content === system_jobs) {
                    return { role, content: system_interviewer}
                  } else {
                    return { role, content: system_jobs}
                  }
                }
                if (role === "user") {
                  return { role: "assistant", content };
                } else {
                  return { role: "user", content };
                }
              });
            },
            inputs: [":reducer"]
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

