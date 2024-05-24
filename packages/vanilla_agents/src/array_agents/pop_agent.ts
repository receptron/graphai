import { AgentFunction } from "graphai";

export const popAgent: AgentFunction<
  Record<string, any>,
  Record<string, any>,
  Array<any>
> = async (context) => {
  const { inputs } = context;
  const array = inputs[0].map((item) => item); // shallow copy
  const item = array.pop();
  return { array, item };
};

const popAgentInfo = {
  name: "popAgent",
  agent: popAgent,
  mock: popAgent,
  samples: [
    {
      inputs: [[1, 2, 3]],
      params: {},
      result: {
        array: [1, 2],
        item: 3,
      },
    },
    {
      inputs: [["a", "b", "c"]],
      params: {},
      result: {
        array: ["a", "b"],
        item: "c",
      },
    },
    {
      inputs: [
        [1, 2, 3],
        ["a", "b", "c"],
      ],
      params: {},
      result: {
        array: [1, 2],
        item: 3,
      },
    },
  ],
  description: "Pop Agent",
  category: ["array"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default popAgentInfo;
