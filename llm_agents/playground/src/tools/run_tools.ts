import "dotenv/config";
import { anthropicAgent } from "@graphai/anthropic_agent";
import { openAIAgent } from "@graphai/openai_agent";
import { toolsAgent } from "@graphai/tools_agent";
import { GraphAI, agentInfoWrapper, type AgentFunction } from "graphai";
import * as agents from "@graphai/vanilla";

import { tools, generalToolAgent } from "./common";

import type { GraphAILLMStreamData } from "@graphai/llm_utils";

import { streamAgentFilterGenerator } from "@graphai/stream_agent_filter";


export const consoleStreamAgentFilter = streamAgentFilterGenerator<GraphAILLMStreamData>((context, data) => {
  if (data.type === "response.in_progress") {
    console.log(data.response);
  }
});

const main = async () => {
  const graph = {
    version: 0.5,
    nodes: {
      messages: {
        value: [],
      },
      text: {
        value: "",
      },
      tools: {
        isResult: true,
        agent: "toolsAgent",
        inputs: {
          messages: ":messages",
          userInput: { text: ":text" },
          tools,
          llmAgent: "anthropicAgent",
          llmModel: "claude-opus-4-1-20250805",
          stream: true,
        },
      },
    },
  };

  const streamAgentFilter = {
    name: "streamAgentFilter",
    agent: consoleStreamAgentFilter,
  };
  const agentFilters = [streamAgentFilter]

  
  const graphai = new GraphAI(graph, { ...agents, toolsAgent, generalToolAgent, openAIAgent, anthropicAgent }, { agentFilters });
  graphai.injectValue("text", "東京・大阪・札幌の天気、USDJPYのレート、AAPLとMSFTの株価を教えて");

  const res = (await graphai.run()) as any;
  console.log(JSON.stringify(res, null, 2));

  const graphai2 = new GraphAI(graph, { ...agents, toolsAgent, generalToolAgent, anthropicAgent });
  graphai2.injectValue("text", "ありがとう。インド、ムンバイの天気は？");
  graphai2.injectValue("messages", res.tools.messages);
  const res2 = (await graphai2.run()) as any;
  console.log(JSON.stringify(res2, null, 2));

};

main();
