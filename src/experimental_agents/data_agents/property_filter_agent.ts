import { AgentFunction } from "@/graphai";
import deepmerge from "deepmerge";

export const propertyFilterAgent: AgentFunction<{ includes: Array<string> }> = async ({ inputs, params }) => {
  const [input] = inputs;
  const { includes } = params;
  return includes.reduce((tmp: Record<string, any>, propId) => {
    tmp[propId] = input[propId];
    return tmp;
  }, {});
};

// for test and document
const sampleInputs = [
  { color: "red", size: 1, type: "car" },
];
const sampleParams = { includes: ["color", "size"] };
const sampleResult = { color: "red", size: 1 };

const propertyFilterAgentInfo = {
  name: "propertyFilterAgent",
  agent: propertyFilterAgent,
  mock: propertyFilterAgent,
  samples: [
    {
      inputs: sampleInputs,
      params: sampleParams,
      result: sampleResult,
    },
  ],
  description: "Filter properties",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default propertyFilterAgentInfo;
