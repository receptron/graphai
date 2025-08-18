import "dotenv/config";
// import { anthropicAgent } from "@graphai/anthropic_agent";
// import { openAIAgent } from "@graphai/openai_agent";
// import { toolsAgent } from "@graphai/tools_agent";
import { anthropicAgent } from "../../../anthropic_agent/src/index";
import { openAIAgent } from "../../../openai_agent/src/index";
import { toolsAgent } from "../../../tools_agent/src/index";

import { GraphAI } from "graphai";

import * as agents from "@graphai/vanilla";

import { tools, generalToolAgent } from "./common";

import type { GraphAILLMStreamData } from "@graphai/llm_utils";

import { streamAgentFilterGenerator } from "@graphai/stream_agent_filter";

export const consoleStreamAgentFilter = streamAgentFilterGenerator<GraphAILLMStreamData>((context, data) => {
  if (data.type === "response.in_progress") {
    console.log(data.response);
  }
});

const graph = {
  version: 0.5,
  nodes: {
    messages: {
      value: [],
    },
    text: {
      value: "",
    },
    llmAgent: {},
    llmModel: {},
    tools: {
      isResult: true,
      agent: "toolsAgent",
      inputs: {
        messages: ":messages",
        userInput: { text: ":text" },
        tools,
        llmAgent: ":llmAgent",
        llmModel: ":llmModel",
        stream: true,
      },
    },
  },
};

export const main = async () => {
  const streamAgentFilter = {
    name: "streamAgentFilter",
    agent: consoleStreamAgentFilter,
  };
  const agentFilters = [streamAgentFilter];

  const aagents = { ...agents, toolsAgent, generalToolAgent, openAIAgent, anthropicAgent };

  const graphai = new GraphAI(graph, aagents, { agentFilters });

  graphai.injectValue("text", "東京・大阪・札幌の天気、USDJPYのレート、AAPLとMSFTの株価を教えて");
  graphai.injectValue("llmAgent", "anthropicAgent");
  graphai.injectValue("llmModel", "claude-opus-4-1-20250805");

  const res = (await graphai.run()) as any;
  console.log(JSON.stringify(res, null, 2));

  const graphai2 = new GraphAI(graph, aagents, { agentFilters });
  graphai2.injectValue("text", "ありがとう。インド、ムンバイの天気は？");
  graphai2.injectValue("messages", res.tools.messages);
  graphai2.injectValue("llmAgent", "openAIAgent");
  graphai2.injectValue("llmModel", "gpt-4o");

  // graphai2.injectValue("llmAgent", "anthropicAgent");
  // graphai2.injectValue("llmModel", "claude-opus-4-1-20250805");

  const res2 = (await graphai2.run()) as any;
  console.log(JSON.stringify(res2, null, 2));
};

export const main2 = async () => {
  const streamAgentFilter = {
    name: "streamAgentFilter",
    agent: consoleStreamAgentFilter,
  };
  const agentFilters = [streamAgentFilter];

  const aagents = { ...agents, toolsAgent, generalToolAgent, openAIAgent, anthropicAgent };

  const graphai = new GraphAI(graph, aagents, { agentFilters });

  graphai.injectValue("text", "東京・大阪・札幌の天気、USDJPYのレート、AAPLとMSFTの株価を教えて");
  graphai.injectValue("llmAgent", "openAIAgent");
  graphai.injectValue("llmModel", "gpt-4o");

  const res = (await graphai.run()) as any;
  console.log(JSON.stringify(res, null, 2));

  const graphai2 = new GraphAI(graph, aagents, { agentFilters });
  graphai2.injectValue("text", "ありがとう。インド、ムンバイの天気は？");
  graphai2.injectValue("messages", res.tools.messages);
  graphai2.injectValue("llmAgent", "anthropicAgent");
  graphai2.injectValue("llmModel", "claude-opus-4-1-20250805");

  const res2 = (await graphai2.run()) as any;
  console.log(JSON.stringify(res2, null, 2));
};

main2();
