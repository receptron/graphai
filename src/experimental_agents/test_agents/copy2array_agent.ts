import { AgentFunction } from "@/index";
import { AgentFunctionInfo } from "@/type";

export const copy2ArrayAgent: AgentFunction<{ count: number }> = async ({ inputs, params }) => {
  return new Array(params.count).fill(undefined).map(() => {
    return inputs[0];
  });
};

// for test and document
const copy2ArrayAgentInfo: AgentFunctionInfo = {
  name: "copy2ArrayAgent",
  agent: copy2ArrayAgent,
  mock: copy2ArrayAgent,
  samples: [
    {
      inputs: [{ message: "hello" }],
      params: { count: 10 },
      result: [
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
      ],
    },
  ],
  description: "Copy2Array agent",
  category: [],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default copy2ArrayAgentInfo;
