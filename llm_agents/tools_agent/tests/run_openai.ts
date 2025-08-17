import "dotenv/config";
import toolsAgent from "../src/tools_agent";
import { GraphAI } from "graphai";
import { openAIAgent } from "@graphai/openai_agent";
import * as agents from "@graphai/vanilla";

import { toolsTestAgent, tools } from "./common";

import test from "node:test";
// import assert from "node:assert";

test("test openai tools", async () => {
  const text = "東京・大阪・札幌の天気、USDJPYのレート、AAPLとMSFTの株価を教えて";

  const graph = {
    version: 0.5,
    nodes: {
      tools: {
        isResult: true,
        agent: "toolsAgent",
        inputs: {
          messages: [],
          userInput: { text },
          tools,
          llmAgent: "openAIAgent",
        },
      },
    },
  };

  const graphai = new GraphAI(graph, { ...agents, toolsAgent, toolsTestAgent, openAIAgent });
  const res = (await graphai.run()) as any;
  console.log(res.tools.messages);
});
