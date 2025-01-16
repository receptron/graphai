import { nestedAgentGenerator } from "@/generator";
import { graphDataLatestVersion } from "graphai";

const updateTextGraph = {
  version: graphDataLatestVersion,
  nodes: {
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

const updateTextAgent = nestedAgentGenerator(updateTextGraph, { resultNodeId: "resultText" });

const updateTextAgentInfo = {
  name: "updateTextAgent",
  agent: updateTextAgent,
  mock: updateTextAgent,
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
  ],
  description: "",
  category: [],
  author: "",
  repository: "",
  tools: [],
  license: "",
  hasGraphData: true,
};

export default updateTextAgentInfo;
