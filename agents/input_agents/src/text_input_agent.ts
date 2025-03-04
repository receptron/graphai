import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIText, GraphAIMessage, GraphAIMessageRole } from "@graphai/agent_utils";
import input from "@inquirer/input";

export const textInputAgent: AgentFunction<
  { message?: string; required?: boolean; role?: GraphAIMessageRole },
  Partial<GraphAIText & GraphAIMessage>
> = async ({ params }) => {
  const { message, required, role } = params;

  while (true) {
    const text = await input({ message: message ?? "Enter" });
    // console.log(!required,  (text ?? '' !== ''), required);
    if (!required || (text ?? "") !== "") {
      return {
        text,
        message: {
          role: role ?? "user",
          content: text,
        },
      };
    }
  }
};

const textInputAgentInfo: AgentFunctionInfo = {
  name: "textInputAgent",
  agent: textInputAgent,
  mock: textInputAgent,
  samples: [
    {
      inputs: {},
      params: { message: "Enter your message to AI." },
      result: {
        text: "message from the user",
        content: {
          role: "user",
          content: "message from the user",
        },
      },
    },
    {
      inputs: {},
      params: { message: "Enter your message to AI.", role: "system" },
      result: {
        text: "message from the user",
        content: {
          role: "system",
          content: "message from the user",
        },
      },
    },
  ],
  description: "Text Input Agent",
  category: ["input"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default textInputAgentInfo;
