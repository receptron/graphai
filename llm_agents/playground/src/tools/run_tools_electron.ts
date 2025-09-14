import "dotenv/config";

import { GraphAI } from "graphai";
// import { anthropicAgent } from "@graphai/anthropic_agent";
// import { openAIAgent } from "@graphai/openai_agent";
// import { toolsAgent } from "@graphai/tools_agent";
import * as agents from "@graphai/vanilla";
import { anthropicAgent } from "../../../anthropic_agent/src/index";
import { openAIAgent } from "../../../openai_agent/src/index";
import { toolsAgent } from "../../../tools_agent/src/index";

import type { GraphAILLMStreamData } from "@graphai/llm_utils";
import { streamAgentFilterGenerator } from "@graphai/stream_agent_filter";

import { tools, generalToolAgent } from "./common";
import mulmoVisionAgent from "./mulmo_vision_agent";
import { messages } from "./electron_messages";

export const consoleStreamAgentFilter = streamAgentFilterGenerator<GraphAILLMStreamData>((context, data) => {
  if (data.type === "response.in_progress") {
    console.log(JSON.stringify(data.response, null, 2));
  }
});

// for mulmo cast app bug
// just chat with tools
export const graphChatWithSearch: GraphData = {
  version: 0.5,
  nodes: {
    messages: {},
    prompt: {},
    llmAgent: {},
    llmModel: {},
    tools: {
      value: [],
    },
    passthrough: {
      value: {},
    },
    llm: {
      isResult: true,
      agent: "toolsAgent",
      inputs: {
        llmAgent: ":llmAgent",
        llmModel: ":llmModel",
        tools: ":tools",
        messages: ":messages",
        passthrough: ":passthrough",
        userInput: {
          text: ":prompt",
          message: {
            role: "user",
            content: ":prompt",
          },
        },
      },
    },
  },
};

// from electron
const filterMessage = (setTime = false) => {
  return (message) => {
    const { role, content, tool_calls, tool_call_id, name, extra } = message;
    if (setTime) {
      return { extra, role, content, tool_calls, tool_call_id, name, time: message.time ?? Date.now() };
    }
    return { extra, role, content, tool_calls, tool_call_id, name };
  };
};

export const main4 = async () => {
  const streamAgentFilter = {
    name: "streamAgentFilter",
    agent: consoleStreamAgentFilter,
  };
  const agentFilters = [streamAgentFilter];

  const aagents = { ...agents, toolsAgent, generalToolAgent, openAIAgent, anthropicAgent, mulmoVisionAgent };

  const graphai = new GraphAI(graphChatWithSearch, aagents, { agentFilters });

  const newMessages = messages.map(filterMessage()).filter((message) => {
    return message.content !== "" || message.tool_calls;
  });

  console.log(JSON.stringify(newMessages, null, 2));

  graphai.injectValue("prompt", "続けて");
  graphai.injectValue("messages", newMessages);
  graphai.injectValue("llmAgent", "anthropicAgent");
  graphai.injectValue("llmModel", "claude-sonnet-4-20250514");
  graphai.injectValue("tools", [...tools, ...mulmoVisionAgent.tools]);

  const res = (await graphai.run()) as any;
  console.log(JSON.stringify(res, null, 2));
};

main4();
