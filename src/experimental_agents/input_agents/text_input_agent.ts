import { AgentFunction } from "@/index";
import input from "@inquirer/input";

export const textInputAgent: AgentFunction<{ resultKey?: string; isReturnString: boolean }, string | { [x: string]: string }> = async ({
    params,
  }) => {
    const { resultKey, isReturnString } = params;
    const answer = await input({ message: "Enter message" });
    if (isReturnString) {
      return answer;
    }
    return { [resultKey ?? "answer"]: answer };
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
