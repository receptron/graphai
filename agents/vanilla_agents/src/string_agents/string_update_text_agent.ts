import { nestedAgentGenerator } from "@/generator";
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
  tools: [],
  license: "",
  hasGraphData: true,
};

export default stringUpdateTextAgentInfo;
