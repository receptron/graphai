import { AgentFunction, AgentFunctionInfo } from "graphai";

export const countingAgent: AgentFunction<{ count: number }, { list: number[] }> = async ({ params }) => {
  return {
    list: new Array(params.count).fill(undefined).map((_, i) => {
      return i;
    }),
  };
};

// for test and document
const countingAgentInfo: AgentFunctionInfo = {
  name: "countingAgent",
  agent: countingAgent,
  mock: countingAgent,
  inputs: {
    type: "object",
    description: "This agent does not require any inputs. Leave empty.",
    properties: {},
    additionalProperties: false,
  },
  params: {
    type: "object",
    description: "Parameter that defines how many numbers to generate, starting from 0.",
    properties: {
      count: {
        type: "integer",
        minimum: 0,
        description: "The number of integers to generate, starting from 0 up to count - 1.",
      },
    },
    required: ["count"],
    additionalProperties: false,
  },
  output: {
    type: "object",
    description: "An object containing a list of sequential integers.",
    properties: {
      list: {
        type: "array",
        description: "An array of integers from 0 to count - 1.",
        items: {
          type: "integer",
        },
      },
    },
    required: ["list"],
    additionalProperties: false,
  },
  samples: [
    {
      inputs: {},
      params: { count: 4 },
      result: { list: [0, 1, 2, 3] },
    },
  ],
  description: "Counting agent",
  category: ["test"],
  cacheType: "pureAgent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/counting_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};

export default countingAgentInfo;
