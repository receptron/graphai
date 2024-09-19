export const graphDataOpenAIMath = {
  version: 0.5,
  nodes: {
    inputData: {
      value: "hello, let me know the answer 1 + 1",
    },
    llm: {
      agent: "openAIAgent",
      inputs: {
        prompt: ":inputData",
      },
    },
  },
};

export const graphDataOpenAIPaint = {
  version: 0.5,
  nodes: {
    inputData: {
      value: "dragon flying in the sky",
    },
    llm: {
      agent: "openAIImageAgent",
      inputs: {
        prompt: ":inputData",
      },
      params: {
        system: "Generate user-specified image",
        model: "dall-e-3",
      },
      isResult: true,
    },
  },
};

export const graphDataOpenAIImageDescription = {
  version: 0.5,
  nodes: {
    inputData: {
      value: "what is this",
    },
    llm: {
      agent: "openAIAgent",
      inputs: {
        prompt: ":inputData",
      },
      params: {
        model: "gpt-4o-mini",
        system: "Describe the given image",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Kumamoto_Castle_Keep_Tower_20221022-3.jpg/1920px-Kumamoto_Castle_Keep_Tower_20221022-3.jpg",
        ],
      },
      isResult: true,
    },
  },
};

export const graphDataOpenAITools = {
  version: 0.5,
  loop: {
    while: ":lastMessage",
  },
  nodes: {
    history: {
      value: [],
      update: ":nextHistory.array",
    },
    lastMessage: {
      value: "",
      update: ":echoData",
    },
    textInput: {
      agent: "textInputAgent",
      params: {
        message: "",
      },
    },
    llm: {
      agent: "openAIAgent",
      params: {
        system: "You are a telephone operator. Listen well to what the other person is saying and decide which one to connect with.",
        tool_choice: "auto",
        tools: [
          {
            type: "function",
            function: {
              name: "dispatchNextEvent",
              description: "Determine which department to respond to next",
              parameters: {
                type: "object",
                properties: {
                  eventType: {
                    type: "string",
                    enum: ["return", "About payment", "How to order", "others", "Defective product"],
                    description: "eventType",
                  },
                },
              },
              required: ["eventType"],
            },
          },
        ],
      },
      inputs: {
        prompt: ":textInput",
        messages: ":history",
      },
      console: {
        after: true,
      },
    },
    messageData: {
      agent: "stringTemplateAgent",
      inputs: [":textInput", ":llm.choices.$0.message.content"],
      params: {
        template: [
          {
            role: "user",
            content: "${0}",
          },
          {
            role: "assistant",
            content: "${1}",
          },
        ],
      },
    },
    echoData: {
      agent: "copyAgent",
      inputs: [":llm.choices.$0.message.content"],
      console: {
        after: true,
      },
    },
    nextHistory: {
      agent: "arrayFlatAgent",
      inputs: {
        array: [":history", ":messageData"],
      },
    },
  },
};
