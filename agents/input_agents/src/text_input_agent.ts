import { AgentFunction, AgentFunctionInfo } from "graphai";
import input from "@inquirer/input";

export const textInputAgent: AgentFunction<{ message?: string; required: boolean }, string | { [x: string]: string }> = async ({ params }) => {
  const { message, required } = params;

  while (true) {
    const result = await input({ message: message ?? "Enter" });
    // console.log(!required,  (result ?? '' !== ''), required);
    if (!required || (result ?? "") !== "") {
      return result;
    }
  }
};

const textInputAgentInfo: AgentFunctionInfo = {
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
  description: "Text Input Agent",
  category: ["input"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default textInputAgentInfo;
