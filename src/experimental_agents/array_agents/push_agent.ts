import { AgentFunction } from "@/index";

export const pushAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>> = async ({ inputs }) => {
  const array = inputs[0].map((item) => item); // shallow copy
  inputs.forEach((input, index) => {
    if (index > 0) {
      array.push(input);
    }
  });
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
    {
      inputs: [[1, 2], 3, 4, 5],
      params: {},
      result: [1, 2, 3, 4, 5],
    },
    {
      inputs: [[{ apple: 1 }], { lemon: 2 }],
      params: {},
      result: [{ apple: 1 }, { lemon: 2 }],
    },
  ],
  description: "push Agent",
  category: [],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default pushAgentInfo;
