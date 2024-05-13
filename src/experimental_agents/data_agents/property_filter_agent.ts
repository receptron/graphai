import { AgentFunction } from "@/graphai";

const applyFilter = (input: any, include: Array<string> | undefined, exclude: Array<string> | undefined) => {
  const propIds = include ? include : Object.keys(input);
  const excludeSet = new Set(exclude ?? []);
  return propIds.reduce((tmp: Record<string, any>, propId) => {
    if (!excludeSet.has(propId)) {
      tmp[propId] = input[propId];
    }
    return tmp;
  }, {});
};

export const propertyFilterAgent: AgentFunction<{ include?: Array<string>; exclude?: Array<string> }> = async ({ inputs, params }) => {
  const [input] = inputs;
  const { include, exclude } = params;
  if (Array.isArray(input)) {
    return input.map((item) => applyFilter(item, include, exclude));
  }
  return applyFilter(input, include, exclude);
};

const inputs = [[
  { color: "red", model: "Model 3", type: "EV", maker: "Tesla", range: 300 },
  { color: "blue", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
]];

const propertyFilterAgentInfo = {
  name: "propertyFilterAgent",
  agent: propertyFilterAgent,
  mock: propertyFilterAgent,
  samples: [
    {
      inputs,
      params: { include: ["color", "model"] },
      result: [{ color: "red", model: "Model 3" }, { color: "blue", model: "Model Y" }],
    },
    {
      inputs,
      params: { exclude: ["color", "model"] },
      result: [{ type: "EV", maker: "Tesla", range: 300 }, { type: "EV", maker: "Tesla", range: 400 }],
    },
  ],
  description: "Filter properties based on property name either with 'include' or 'exclude'",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default propertyFilterAgentInfo;
