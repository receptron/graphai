import { AgentFunction } from "@/graphai";

export const pushAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>> = async ({ inputs }) => {
  const array = inputs[0].map((item) => item); // sharrow copy
  array.push(inputs[1]);
  return array;
};

const pushAgentInfo = {
  name: "pushAgent",
  agent: pushAgent,
  mock: pushAgent,
  samples: [
    {
      inputs: [[1, 2], 3],
      params: {},
      result: [1, 2, 3],
    },
  ],
  description: "push Agent",
  category: [],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default pushAgentInfo;
