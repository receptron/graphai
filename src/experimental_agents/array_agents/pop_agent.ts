import { AgentFunction } from "@/graphai";
import deepmerge from "deepmerge";

export const popAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>> = async (context) => {
  const { inputs } = context;
  const [array] = deepmerge({ inputs }, {}).inputs;
  // TODO: Validation
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
