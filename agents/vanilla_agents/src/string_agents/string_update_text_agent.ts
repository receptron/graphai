import { nestedAgentGenerator } from "../generator";
import { graphDataLatestVersion, AgentFunctionInfo } from "graphai";

const stringUpdateTextGraph = {
  version: graphDataLatestVersion,
  nodes: {
    newText: {
      value: "",
    },
    oldText: {
      value: "",
    },
    isNewText: {
      if: ":newText",
      agent: "copyAgent",
      inputs: {
        text: ":newText",
      },
    },
    isOldText: {
      unless: ":newText",
      agent: "copyAgent",
      inputs: {
        text: ":oldText",
      },
    },
    updatedText: {
      agent: "copyAgent",
      anyInput: true,
      inputs: {
        text: [":isNewText.text", ":isOldText.text"],
      },
    },
    resultText: {
      isResult: true,
      agent: "copyAgent",
      anyInput: true,
      inputs: {
        text: ":updatedText.text.$0",
      },
    },
  },
};

const stringUpdateTextAgent = nestedAgentGenerator(stringUpdateTextGraph, { resultNodeId: "resultText" });

const stringUpdateTextAgentInfo: AgentFunctionInfo = {
  name: "stringUpdateTextAgent",
  agent: stringUpdateTextAgent,
  mock: stringUpdateTextAgent,
  inputs: {
    type: "object",
    properties: {
      newText: {
        type: "string",
        description: "The new text to use if provided and not empty.",
      },
      oldText: {
        type: "string",
        description: "The fallback text used if 'newText' is empty or not provided.",
      },
    },
    additionalProperties: false,
  },
  params: {
    type: "object",
    description: "No parameters are used in this agent.",
    properties: {},
    additionalProperties: false,
  },
  output: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "The resulting text. It is either the value of 'newText' if non-empty, otherwise 'oldText', or an empty string if both are missing.",
      },
    },
    required: ["text"],
    additionalProperties: false,
  },
  samples: [
    {
      inputs: { newText: "new", oldText: "old" },
      params: {},
      result: { text: "new" },
    },
    {
      inputs: { newText: "", oldText: "old" },
      params: {},
      result: { text: "old" },
    },
    {
      inputs: {},
      params: {},
      result: { text: "" },
    },
    {
      inputs: { oldText: "old" },
      params: {},
      result: { text: "old" },
    },
  ],
  description: "",
  category: [],
  author: "",
  repository: "",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/string_update_text_agent.ts",
  package: "@graphai/vanilla",
  tools: [],
  license: "",
  hasGraphData: true,
};

export default stringUpdateTextAgentInfo;
