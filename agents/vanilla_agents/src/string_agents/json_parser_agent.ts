import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIWithOptionalTextAndData } from "@graphai/agent_utils";

export const jsonParserAgent: AgentFunction<null, unknown, GraphAIWithOptionalTextAndData> = async ({ namedInputs }) => {
  const { text, data } = namedInputs;

  if (data) {
    return {
      text: JSON.stringify(data, null, 2),
    };
  }
  const match = ("\n" + text).match(/\n```[a-zA-Z]*([\s\S]*?)\n```/);
  if (match) {
    return {
      data: JSON.parse(match[1]),
    };
  }
  return {
    data: JSON.parse(text ?? ""),
  };
};

const sample_object = { apple: "red", lemon: "yellow" };

const json_str = JSON.stringify(sample_object);
const md_json1 = ["```", json_str, "```"].join("\n");

const md_json2 = ["```json", json_str, "```"].join("\n");

const md_json3 = ["```JSON", json_str, "```"].join("\n");

const jsonParserAgentInfo: AgentFunctionInfo = {
  name: "jsonParserAgent",
  agent: jsonParserAgent,
  mock: jsonParserAgent,
  inputs: {
    type: "object",
    description: "The input object containing either a JSON string in 'text' or a raw JavaScript object in 'data'. One of them is required.",
    properties: {
      text: {
        type: "string",
        description: "A JSON string, possibly embedded in a Markdown code block. If provided, it will be parsed into a data object.",
      },
      data: {
        anyOf: [{ type: "object" }, { type: "array" }, { type: "string" }, { type: "number" }],
        description: "Raw data to be converted into a formatted JSON string in the 'text' output.",
      },
    },
    required: [],
    additionalProperties: false,
  },
  params: {
    type: "object",
    description: "No parameters are required for this agent.",
    properties: {},
    additionalProperties: false,
  },
  output: {
    type: "object",
    description: "Returns either a parsed data object (from 'text') or a formatted JSON string (from 'data').",
    properties: {
      text: {
        type: "string",
        description: "A pretty-printed JSON string generated from the 'data' input, if provided.",
      },
      data: {
        anyOf: [{ type: "object" }, { type: "array" }, { type: "string" }, { type: "number" }],
        description: "Parsed data object from the 'text' input, or the original 'data' if no parsing was required.",
      },
    },
    required: [],
    additionalProperties: false,
  },
  samples: [
    {
      inputs: { data: sample_object },
      params: {},
      result: { text: JSON.stringify(sample_object, null, 2) },
    },
    {
      inputs: { text: JSON.stringify(sample_object, null, 2) },
      params: {},
      result: { data: sample_object },
    },
    {
      inputs: { text: md_json1 },
      params: {},
      result: { data: sample_object },
    },
    {
      inputs: { text: md_json2 },
      params: {},
      result: { data: sample_object },
    },
    {
      inputs: { text: md_json3 },
      params: {},
      result: { data: sample_object },
    },
  ],
  description: "Template agent",
  category: ["string"],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/json_parser_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default jsonParserAgentInfo;
