import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const copyAgent: AgentFunction<{
  namedKey?: string;
}> = async ({ namedInputs, params }) => {
  const { namedKey } = params;
  assert(isNamedInputs(namedInputs), "copyAgent: namedInputs is UNDEFINED!");
  if (namedKey) {
    return namedInputs[namedKey];
  }
  return namedInputs;
};

const copyAgentInfo: AgentFunctionInfo = {
  name: "copyAgent",
  agent: copyAgent,
  mock: copyAgent,
  inputs: {
    type: "object",
    description: "A dynamic object containing any number of named input fields. The agent either returns the whole object or a single value by key.",
    additionalProperties: {
      type: ["string", "number", "boolean", "object", "array", "null"],
      description: "A value associated with a named input key. Can be any JSON-compatible type.",
    },
  },
  params: {
    type: "object",
    properties: {
      namedKey: {
        type: "string",
        description: "If specified, the agent will return only the value associated with this key from namedInputs.",
      },
    },
    additionalProperties: false,
  },
  output: {
    anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
  },
  samples: [
    {
      inputs: { color: "red", model: "Model 3" },
      params: {},
      result: { color: "red", model: "Model 3" },
    },
    {
      inputs: { array: ["Hello World", "Discarded"] },
      params: {},
      result: { array: ["Hello World", "Discarded"] },
    },
    {
      inputs: { color: "red", model: "Model 3" },
      params: { namedKey: "color" },
      result: "red",
    },
  ],
  description: "Returns namedInputs",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/copy_agent.ts",

  package: "@graphai/vanilla",
  license: "MIT",
};
export default copyAgentInfo;
