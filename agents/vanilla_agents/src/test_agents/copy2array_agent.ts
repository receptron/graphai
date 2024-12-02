import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const copy2ArrayAgent: AgentFunction<{ count: number }> = async ({ namedInputs, params }) => {
  assert(isNamedInputs(namedInputs), "copy2ArrayAgent: namedInputs is UNDEFINED!");
  const input = (namedInputs.item ? namedInputs.item : namedInputs);
  return new Array(params.count).fill(undefined).map(() => {
    return input;
  });
};

// for test and document
const copy2ArrayAgentInfo: AgentFunctionInfo = {
  name: "copy2ArrayAgent",
  agent: copy2ArrayAgent,
  mock: copy2ArrayAgent,
  samples: [
    {
      inputs: { item: { message: "hello" } },
      params: { count: 10 },
      result: [
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
      ],
    },
    {
      inputs: { message: "hello" },
      params: { count: 10 },
      result: [
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
        { message: "hello" },
      ],
    },
    {
      inputs: { item: "hello" },
      params: { count: 10 },
      result: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
    },
  ],
  description: "Copy2Array agent",
  category: ["test"],
  cacheType: "pureAgent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default copy2ArrayAgentInfo;
