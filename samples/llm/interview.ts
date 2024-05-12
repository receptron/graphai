import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, shiftAgent, nestedAgent } from "@/experimental_agents";
import input from "@inquirer/input";


const system_interviewer = "You are a professional interviewer. It is your job to dig into the personality of the person, making some tough questions. In order to engage the audience, ask questions one by one, and respond to the answer before moving to the next topic.";
const system_jobs = "You are Steve Jobs.";
const query = "Hi, I'm Steve Jobs.";

const graph_data = {
  version: 0.3,
  loop: {
    count: 1,
  },
  nodes: {
    messages: {
      // This node holds the conversation, array of messages.
      value: [
        { role: "system", content: system_interviewer },
        { role: "user", content: "Hi, I'm Steve Jobs" }
      ],
      update: ":reducer",
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
    output: {
      // This node displays the responce to the user.
      agent: (answer: string) => console.log(`Interviewer: ${answer}\n`),
      inputs: [":groq.choices.$0.message.content"],
    },
    reducer: {
      // This node append the responce to the messages.
      agent: "pushAgent",
      inputs: [":messages", ":groq.choices.$0.message"],
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
    },
    () => {},
    false,
  );
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}

