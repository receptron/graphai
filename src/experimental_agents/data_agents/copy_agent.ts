import { AgentFunction } from "@/graphai";

export const copyAgent: AgentFunction = async ({ inputs }) => {
  const [input] = inputs;
  return input;
};

const copyAgentInfo = {
  name: "copyAgent",
  agent: copyAgent,
  mock: copyAgent,
  samples: [
    {
      inputs: [{ color: "red", model: "Model 3" }],
      params: {},
      result: { color: "red", model: "Model 3" },
    },
    {
      inputs: ["Hello World"],
      params: {},
      result: "Hello World",
    },
  ],
  description: "Returns inputs[0]",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default copyAgentInfo;
