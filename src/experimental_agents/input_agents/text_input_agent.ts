import { AgentFunction } from "@/index";
import input from "@inquirer/input";

export const textInputAgent: AgentFunction<{ message?: string }, string | { [x: string]: string }> = async ({ params }) => {
  return await input({ message: params.message ?? "Enter" });
};

const textInputAgentInfo = {
  name: "textInputAgent",
  agent: textInputAgent,
  mock: textInputAgent,
  samples: [],
  description: "Text Input Agent",
  category: ["array"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default textInputAgentInfo;
