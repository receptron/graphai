import { AgentFunction } from "@/graphai";

// eslint-disable-next-line @typescript-eslint/ban-types
export const functionAgent: AgentFunction<{ function: Function }, any, any> = async ({ inputs, params }) => {
  return params.function(...inputs);
};

const carInfo = { model: "Model 3", maker: "Tesla", range: 300, price: 35000 };

const functionAgentInfo = {
  name: "functionAgent",
  agent: functionAgent,
  mock: functionAgent,
  samples: [
    {
      inputs: [carInfo],
      params: {
        function: (info: Record<string, any>) => {
          const { model, maker, range, price } = info;
          return `A ${maker} ${model} has the range of ${range} miles. It costs $${price}.`;
        },
      },
      result: "A Tesla Model 3 has the range of 300 miles. It costs $35000.",
    },
    {
      inputs: [JSON.stringify(carInfo)],
      params: {
        function: (str: string) => {
          return JSON.parse(str);
        },
      },
      result: carInfo,
    },
  ],
  description: "Filter properties based on property name either with 'include' or 'exclude'",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default functionAgentInfo;
