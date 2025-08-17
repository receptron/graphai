import type { AgentFunctionInfo } from "graphai";
import { nestedAgentGenerator } from "@graphai/vanilla/lib/generator";

const toolWorkFlowStep = {
  version: 0.5,
  nodes: {
    passthrough: { value: {} },
    llmAgent: {},
    llmModel: { value: "" },
    stream: { value: true },
    llmCallWithTools: {
      agent: ":llmAgent",
      isResult: true,
      params: {
        forWeb: true,
      },
      inputs: {
        messages: ":messages",
        prompt: ":userInput.text",
        tools: ":tools",
        params: {
          model: ":llmModel",
          dataStream: ":stream",
        },
      },
    },
    // case1. return just messages
    justTextMessagesResult: {
      unless: ":llmCallWithTools.tool.id",
      agent: "pushAgent",
      params: {
        arrayKey: "messages",
      },
      inputs: {
        array: ":messages",
        items: [{ role: "user", content: ":userInput.text" }, ":llmCallWithTools.message"],
      },
    },
    // Call agents specified in the tools result
    llmToolAgentCallMap: {
      if: ":llmCallWithTools.tool.id",
      agent: "mapAgent",
      inputs: {
        rows: ":llmCallWithTools.tool_calls",
        passthrough: ":passthrough",
      },
      params: {
        compositeResult: true,
        rowKey: "llmToolCall",
      },
      graph: {
        version: 0.5,
        nodes: {
          data: {
            agent: ({ passthrough, agentName }: { passthrough: Record<string, unknown>; agentName: string }) => {
              if (passthrough && passthrough[agentName]) {
                return passthrough[agentName];
              }
              return {};
            },
            inputs: {
              passthrough: ":passthrough",
              agentName: ":llmToolCall.name.split(--).$0",
            },
          },
          toolCallAgent: {
            isResult: true,
            agent: ":llmToolCall.name.split(--).$0",
            inputs: {
              arg: ":llmToolCall.arguments",
              func: ":llmToolCall.name.split(--).$1",
              tool_call: ":llmToolCall",
              data: ":data",
            },
          },
          toolsAgentResponseMessage: {
            isResult: true,
            agent: "copyAgent",
            inputs: {
              role: "tool",
              tool_call_id: ":llmToolCall.id",
              content: ":toolCallAgent.content",
              extra: {
                agent: ":llmToolCall.name.split(--).$0",
                arg: ":llmToolCall.arguments",
                func: ":llmToolCall.name.split(--).$1",
              },
            },
          },
        },
      },
    },
    toolsMessage: {
      agent: "pushAgent",
      inputs: {
        array: [{ role: "user", content: ":userInput.text" }, ":llmCallWithTools.message"],
        items: ":llmToolAgentCallMap.toolsAgentResponseMessage",
      },
    },
    // next llm flow
    toolsResponseLLM: {
      agent: ":llmAgent",
      isResult: true,
      params: {
        forWeb: true,
      },
      inputs: {
        messages: ":toolsMessage.array",
        params: {
          model: ":llmModel",
          dataStream: ":stream",
        },
      },
    },
    toolsResponseMessages: {
      isResult: true,
      agent: "pushAgent",
      inputs: {
        array: ":toolsMessage.array",
        item: ":toolsResponseLLM.message",
      },
    },
    // finally merge data
    mergedData: {
      inputs: {
        data: ":llmToolAgentCallMap.toolCallAgent",
        llmToolCalls: ":llmCallWithTools.tool_calls",
      },
      agent: ({ llmToolCalls, data }: { llmToolCalls: { name: string }[]; data: unknown[] }) => {
        const ret: Record<string, unknown> = {};
        llmToolCalls.forEach((tool, index) => {
          const { name } = tool;
          ret[name] = data[index];
        });
        return ret;
      },
    },
    toolsResult: {
      agent: "pushAgent",
      params: {
        arrayKey: "messages",
      },
      inputs: {
        array: ":messages",
        items: ":toolsResponseMessages.array",
        data: ":mergedData",
      },
    },
    result: {
      isResult: true,
      anyInput: true,
      agent: "arrayFindFirstExistsAgent",
      inputs: { array: [":justTextMessagesResult", ":toolsResult"] },
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
