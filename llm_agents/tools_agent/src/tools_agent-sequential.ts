import type { AgentFunctionInfo } from "graphai";
import { nestedAgentGenerator } from "@graphai/vanilla/lib/generator";

const toolWorkFlowStep = {
  version: 0.5,
  nodes: {
    passthrough: { value: {} },
    llmAgent: {},

    llmCallWithTools: {
      agent: ":llmAgent",
      isResult: true,
      params: {
        forWeb: true,
        dataStream: true,
      },
      inputs: {
        messages: ":messages",
        prompt: ":userInput.text",
        tools: ":tools",
      },
    },
    textMessagesResult: {
      // console: { before: true},
      agent: "pushAgent",
      params: {
        arrayKey: "messages",
      },
      inputs: {
        array: ":messages",
        items: [{ role: "user", content: ":userInput.text" }, ":llmCallWithTools.message"],
      },
    },
    // case1. return just messages
    justTextMessagesResult: {
      unless: ":llmCallWithTools.tool.id",
      agent: "copyAgent",
      params: {
        arrayKey: "messages",
      },
      inputs: {
        messages: ":textMessagesResult.messages",
      },
    },
    // Call agents specified in the tools result
    llmToolAgentCallMap: {
      if: ":llmCallWithTools.tool_calls",
      agent: "nestedAgent",
      // console: { before: true},
      inputs: {
        llmToolCalls: ":llmCallWithTools.tool_calls",
        passthrough: ":passthrough",
        toolsResponseMessages: ":textMessagesResult.messages",
        llmAgent: ":llmAgent",
      },
      graph: {
        version: 0.5,
        loop: {
          while: ":llmToolCalls",
        },
        nodes: {
          toolsResponseMessages: {
            // value: ":messages",
            update: ":toolsResponseResultMessages.messages",
          },
          llmToolCalls: {
            value: [],
            update: ":llmToolCall.array",
          },
          llmToolCall: {
            agent: "shiftAgent",
            inputs: {
              array: ":llmToolCalls",
            },
          },
          toolCallAgent: {
            agent: ":llmToolCall.item.name.split(--).$0",
            inputs: {
              arg: ":llmToolCall.item.arguments",
              func: ":llmToolCall.item.name.split(--).$1",
              tool_call: ":llmToolCall.item",
            },
          },
          toolCallMessagesResult: {
            // console: { before: true},
            agent: "pushAgent",
            params: {
              arrayKey: "messages",
            },
            inputs: {
              array: ":toolsResponseMessages",
              // array: ":messages",
              item: {
                role: "tool",
                tool_call_id: ":llmToolCall.item.id",
                name: ":llmToolCall.item.name",
                content: ":toolCallAgent.content",
                extra: {
                  agent: ":llmToolCall.item.name.split(--).$0",
                  arg: ":llmToolCall.item.arguments",
                  func: ":llmToolCall.item.name.split(--).$1",
                  data: ":toolCallAgent.data",
                },
              },
            },
          },
          toolsResponseLLM: {
            agent: ":llmAgent",
            params: {
              forWeb: true,
              dataStream: true,
            },
            inputs: { messages: ":toolCallMessagesResult.messages" },
          },
          toolsResponseResultMessages: {
            isResult: true,
            // console: { after: true},
            agent: "pushAgent",
            params: {
              arrayKey: "messages",
            },
            inputs: {
              array: ":toolCallMessagesResult.messages",
              item: ":toolsResponseLLM.message",
            },
          },
        },
      },
    },
    result: {
      isResult: true,
      anyInput: true,
      agent: "arrayFindFirstExistsAgent",
      inputs: { array: [":justTextMessagesResult", ":llmToolAgentCallMap.toolsResponseResultMessages"] },
    },
  },
};

const toolsAgent = nestedAgentGenerator(toolWorkFlowStep, { resultNodeId: "result" });

const toolsAgentInfo: AgentFunctionInfo = {
  name: "toolsAgent",
  agent: toolsAgent,
  mock: toolsAgent,
  samples: [
    {
      inputs: {
        llmAgent: "openAIAgent",
        tools: [
          {
            type: "function",
            function: {
              name: "lightAgent--toggleLight",
              description: "Switch of light",
              parameters: {
                type: "object",
                properties: {
                  switch: {
                    type: "boolean",
                    description: "change light state",
                  },
                },
              },
            },
          },
        ],
        messages: [
          {
            role: "system",
            content: "You are a light switch. Please follow the user's instructions.",
          },
        ],
        userInput: {
          text: "turn on the light.",
          message: {
            role: "user",
            content: "turn on the light.",
          },
        },
      },
      params: {},
      result: "",
    },
  ],
  description: "",
  category: [],
  author: "",
  repository: "",
  source: "https://github.com/receptron/graphai/blob/main/llm_agents/tools_agent/src/tools_agent.ts",
  package: "@graphai/tools_agent",
  license: "",
  hasGraphData: true,
};

export default toolsAgentInfo;
