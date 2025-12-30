/*
  This agent is an Exa agent.
 */
import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import type { GraphAIOnError } from "@graphai/agent_utils";
import Exa from "exa-js";

type GraphAIHttpDebug = {
  query?: string;
};

export const exaAgent: AgentFunction<
  Partial<{ apiKey?: string } & { numResults?: number }>,
  GraphAIOnError<string> | GraphAIHttpDebug | any,
  {
    query: string;
  }
> = async ({ namedInputs, params }) => {
  const { query } = namedInputs;

  const apiKey = params.apiKey ?? undefined
  const key = apiKey ?? (typeof process !== "undefined" && typeof process.env !== "undefined" ? process.env["EXA_AI_API_KEY"] : null);
  assert(!!key, "EXA_AI_API_KEY is missing in the environment.");

  const exaOptions = {
    numResults: params.numResults ?? 10,
  };

  const exa = new Exa(key);
  const result = await exa.search(query, exaOptions);
  return result.results;
};

const exaAgentInfo: AgentFunctionInfo = {
  name: "exaAgent",
  agent: exaAgent,
  mock: exaAgent,
  inputs: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "query",
      },
    },
    required: ["query"],
  },
  output: {
    type: "array",
  },
  samples: [
    {
      inputs: { query: "What is GraphAI?" },
      params: {
        numResults: 1
      },
      result: [
        {
          id: 'https://www.graphai.tech/',
          title: 'GraphAI',
          url: 'https://www.graphai.tech/',
          author: null,
          text: 'GraphAI is ...',
        },
      ],
    },
  ],
  description: "Retrieves search result of given query with Exa AI",
  category: ["service"],
  author: "Receptron",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/service_agents/src/exa_agent.ts",
  package: "@graphai/service_agents",
  license: "MIT",
  environmentVariables: ["EXA_AI_API_KEY"],
};
export default exaAgentInfo;
