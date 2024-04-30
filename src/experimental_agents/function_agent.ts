import { AgentFunction } from "@/graphai";

// eslint-disable-next-line @typescript-eslint/ban-types
export const functionAgent: AgentFunction<{ function: Function }, any, any> = async ({ inputs, params }) => {
  return params.function(...inputs);
};

const inputs = [{ model: "Model 3", maker: "Tesla", range: 300 }];

const functionAgentInfo = {
  name: "functionAgent",
  agent: functionAgent,
  mock: functionAgent,
  samples: [
    {
      inputs,
      params: {
        function: (info: Record<string, any>) => {
          const { model, maker, range } = info;
          return `A ${maker} ${model} has the range of ${range} miles.`;
        },
      },
      result: "A Tesla Model 3 has the range of 300 miles.",
    },
    {
      inputs: ['{ "model": "Model 3", "maker": "Tesla", "range": 300 }'],
      params: {
        function: (str: string) => {
          return JSON.parse(str);
        },
      },
      result: { model: "Model 3", maker: "Tesla", range: 300 },
    },
  ],
  description: "Filter properties based on property name either with 'include' or 'exclude'",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default functionAgentInfo;
