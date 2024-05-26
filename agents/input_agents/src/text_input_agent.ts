import { AgentFunction } from "graphai";
import input from "@inquirer/input";

export const textInputAgent: AgentFunction<{ message?: string }, string | { [x: string]: string }> = async ({ params }) => {
  return await input({ message: params.message ?? "Enter" });
};

const textInputAgentInfo = {
  name: "textInputAgent",
  agent: textInputAgent,
  mock: textInputAgent,
  samples: [
    {
      inputs: [],
      params: { message: "Enter your message to AI." },
      result: "message from the user",
    },
  ],
  skipTest: true,
  description: "Text Input Agent",
  category: ["input"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default textInputAgentInfo;
