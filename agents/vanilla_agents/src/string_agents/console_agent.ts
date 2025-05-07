import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAINullableText } from "@graphai/agent_utils";

export const consoleAgent: AgentFunction<null, unknown, GraphAINullableText> = async ({ namedInputs }) => {
  const { text } = namedInputs;
  console.info(text);
  return {
    text,
  };
};

const consoleAgentInfo: AgentFunctionInfo = {
  name: "consoleAgent",
  agent: consoleAgent,
  mock: consoleAgent,
  inputs: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "text",
      },
    },
  },
  output: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "text",
      },
    },
  },
  samples: [
    {
      inputs: { text: "hello" },
      params: {},
      result: { text: "hello" },
    },
  ],
  description: "Just text to console.info",
  category: ["string"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/console_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default consoleAgentInfo;
