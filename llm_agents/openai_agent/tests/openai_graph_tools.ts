import { GraphAI } from "graphai";
import "dotenv/config";

import { openAIAgent } from "../src/index";
import { textInputAgent } from "@graphai/input_agents"
import { compareAgent, stringTemplateAgent, pushAgent, copyAgent } from "@graphai/vanilla";

export const graphMap = {
  version: 0.5,
  loop: {
    while: ":continue",
  },
  nodes: {
    continue: {
      value: true,
      update: ":checkInput",
    },
    messages: {
      value: [
        {
          role: "system",
          content:
            "You are an operator for Google Maps. Follow the user's instructions and call the necessary functions accordingly."
        },
      ],
      update: ":reducer.array",
    },
    userInput: {
      agent: "textInputAgent",
      params: {
        message: "You:",
      },
    },
    checkInput: {
      // Checks if the user wants to terminate the chat or not.
      agent: "compareAgent",
      inputs: { array: [":userInput.text", "!=", "/bye"] },
    },
    llm: {
      console: {before: true},
      agent: "openAIAgent",
      isResult: true,
      params: {
        tools: [
          {
            type: "function",
            function: {
              name: "setCenter",
              description: "set center location",
              parameters: {
                type: "object",
                properties: {
                  lat: {
                    type: "number",
                    description: "latitude of center",
                  },
                  lng: {
                    type: "number",
                    description: "longtitude of center",
                  },
                },
                required: ["lat", "lng"],
              },
            },
          },
        ]
      },
      inputs: { messages: ":messages", prompt: ":userInput.text" },
    },
    output: {
      agent: "stringTemplateAgent",
      inputs: {
        text: "\x1b[32mAgent\x1b[0m: ${:llm.text}",
      },
    },
    textMessage: {
      unless: ":llm.tool.id",
      console: {before: true, after: true},
      agent: "stringTemplateAgent",
      params: {
        template: {messages: ["${one}", "${two}"]},
      },
      inputs: {
        one: ":userInput.message",
        two: ":llm.message"
      },
    },
    toolsMessage: {
      if: ":llm.tool.id",
      agent: "stringTemplateAgent",
      params: {
        template: {messages: ["${one}", "${two}", {
          role: "tool",
          tool_call_id: ":llm.tool.id",
          name: ":llm.tool.name",
          content: "success",
        }]},
      },
      inputs: {
        one: ":userInput.message",
        two: ":llm.message"
      },
    },
    buffer: {
      agent: "copyAgent",
      anyInput: true,
      inputs: { array: [":textMessage.messages", ":toolsMessage.messages"] },
    },
    reducer: {
      agent: "pushAgent",
      inputs: { array: ":messages", items: ":buffer.array.$0" },
    },
  },
};

const main = async () => {
  const graphai = new GraphAI(graphMap, { openAIAgent, textInputAgent, compareAgent, stringTemplateAgent, pushAgent, copyAgent });
  const res = await graphai.run();
  console.log(res);
};

main();
