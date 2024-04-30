import { AgentFunction } from "@/graphai";
import deepmerge from "deepmerge";

export const propertyFilterAgent: AgentFunction<{ include?: Array<string>; exclude?: Array<string> }> = async ({ inputs, params }) => {
  const [input] = inputs;
  const { include, exclude } = params;
  const propIds = include ? include : Object.keys(input);
  const excludeSet = new Set(exclude ?? []);
  return propIds.reduce((tmp: Record<string, any>, propId) => {
    if (!excludeSet.has(propId)) {
      tmp[propId] = input[propId];
    }
    return tmp;
  }, {});
};

const inputs = [{ color: "red", model: "Model 3", type: "EV", maker: "Tesla", range: 300 }];

const propertyFilterAgentInfo = {
  name: "propertyFilterAgent",
  agent: propertyFilterAgent,
  mock: propertyFilterAgent,
  samples: [
    {
      inputs,
      params: { include: ["color", "model"] },
      result: { color: "red", model: "Model 3" },
    },
    {
      inputs,
      params: { exclude: ["color", "model"] },
      result: { type: "EV", maker: "Tesla", range: 300 },
    },
  ],
  description: "Filter properties based on property name either with 'include' or 'exclude'",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default propertyFilterAgentInfo;
