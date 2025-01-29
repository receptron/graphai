import { nestedAgentGenerator } from "@graphai/vanilla/lib/generator";

const toolWorkFlowStep = {
  version: 0.5,
  nodes: {
    llm: {
      agent: ":llmAgent",
      isResult: true,
      params: {
        forWeb: true,
        stream: true,
        tools: ":tools",
      },
      inputs: { messages: ":messages", prompt: ":userInput.text" },
    },
    textMessage: {
      unless: ":llm.tool.id",
      agent: "copyAgent",
      inputs: {
        messages: [":userInput.message", { role: "assistant", content: ":llm.message.content" }],
      },
    },
    tool_calls: {
      if: ":llm.tool_calls",
      agent: "mapAgent",
      inputs: { rows: ":llm.tool_calls" },
      params: {
        compositeResult: true,
      },
      graph: {
        version: 0.5,
        nodes: {
          tool: {
            isResult: true,
            agent: ":row.name.split(--).$0",
            inputs: {
              arg: ":row.arguments",
              func: ":row.name.split(--).$1",
              tool_call: ":row",
            },
          },
          message: {
            isResult: true,
            agent: "copyAgent",
            inputs: {
              role: "tool",
              tool_call_id: ":row.id",
              name: ":row.name",
              content: ":tool.result",
            },
          },
        },
      },
    },
    // tools response if hasNext in response.
    toolsMessage: {
      agent: "pushAgent",
      inputs: {
        array: [":userInput.message", ":llm.message"],
        items: ":tool_calls.message",
      },
    },
    tool_call_response: {
      agent: "nestedAgent",
      inputs: {
        toolsResponse: ":tool_calls.tool",
        llmAgent: ":llmAgent",
        toolsMessage: ":toolsMessage",
      },
      graph: {
        nodes: {
          hasNext: {
            agent: (namedInputs: { array: { hasNext: boolean }[] }) => {
              return namedInputs.array.some((ele) => ele.hasNext);
            },
            inputs: {
              array: ":toolsResponse",
            },
          },
          toolsResponseLLM: {
            if: ":hasNext",
            agent: ":llmAgent",
            isResult: true,
            params: {
              forWeb: true,
              stream: true,
            },
            inputs: { messages: ":toolsMessage.array" },
          },
          toolsResMessage: {
            agent: "pushAgent",
            inputs: {
              array: ":toolsMessage.array",
              item: ":toolsResponseLLM.message",
            },
          },
          skipToolsResponseLLM: {
            unless: ":hasNext",
            agent: "copyAgent",
            inputs: {
              array: ":toolsMessage.array",
            },
          },
          mergeToolsResponse: {
            isResult: true,
            agent: "copyAgent",
            anyInput: true,
            inputs: { array: [":toolsResMessage.array", ":skipToolsResponseLLM.array"] },
          },
        },
      },
    },
    buffer: {
      agent: "copyAgent",
      anyInput: true,
      inputs: { array: [":textMessage.messages", ":tool_call_response.mergeToolsResponse.array.$0"] },
    },
    reducer: {
      agent: "pushAgent",
      inputs: { array: ":messages", items: ":buffer.array.$0" },
    },
    result: {
      agent: "copyAgent",
      isResult: true,
      inputs: { messages: ":reducer.array" },
    },
  },
};

const toolsAgent = nestedAgentGenerator(toolWorkFlowStep, { resultNodeId: "result" });

const toolsAgentInfo = {
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
  tools: [],
  license: "",
  hasGraphData: true,
};

export default toolsAgentInfo;
