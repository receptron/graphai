import { AgentFunction } from "graphai";

export const shiftAgent: AgentFunction<
  Record<string, any>,
  Record<string, any>,
  Array<any>
> = async (context) => {
  const { inputs } = context;
  const array = inputs[0].map((item) => item); // shallow copy
  const item = array.shift();
  return { array, item };
};

const shiftAgentInfo = {
  name: "shiftAgent",
  agent: shiftAgent,
  mock: shiftAgent,
  samples: [
    {
      inputs: [[1, 2, 3]],
      params: {},
      result: {
        array: [2, 3],
        item: 1,
      },
    },
    {
      inputs: [["a", "b", "c"]],
      params: {},
      result: {
        array: ["b", "c"],
        item: "a",
      },
    },
  ],
  description: "shift Agent",
  category: ["array"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default shiftAgentInfo;
