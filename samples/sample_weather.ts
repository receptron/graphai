import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, nestedAgent, copyAgent, fetchAgent } from "@/experimental_agents";
import input from "@inquirer/input";

const tools = [
  {
    type: "function",
    function: {
      name: "getWeather",
      description: "get wether information of the specified location",
      parameters: {
        type: "object",
        properties: {
          latitude: {
            type: "number",
            description: "The latitude of the location.",
          },
          longitude: {
            type: "number",
            description: "The longitude of the location.",
          },
        },
        required: ["latitude", "longitude"],
      },
    },
  },
];

const graph_data = {
  version: 0.2,
  loop: {
    while: "continue",
  },
  nodes: {
    continue: {
      value: true,
      update: "checkInput",
    },
    messages: {
      // This node holds the conversation, array of messages.
      value: [ {role: "system", content:"You are a meteorologist. Use getWeather API, only when the user ask for the weather information."} ],
      update: "reducerAll",
      isResult: true,
    },
    debugMessage: {
      // Display roles of messages
      agent: (messages:any) => {
        const roles = messages.map((message:any) => message.role);
        console.log(roles);
      },
      inputs: ["messages"]
    },
    userInput: {
      // This node receives an input from the user.
      agent: () => input({ message: "You:" }),
    },
    checkInput: {
      // This node chackes if the user wants to end the conversation.
      agent: (query: string) => query !== "/bye",
      inputs: ["userInput"],
    },
    appendedMessages: {
      // This node appends the user's input to the messages.
      agent: (messages: Array<any>, content: string) => [...messages, { role: "user", content }],
      inputs: ["messages", "userInput"],
      if: "checkInput",
    },
    groq: {
      // This node sends those messages to Llama3 on groq to get the answer.
      agent: "groqAgent",
      params: {
        model: "Llama3-8b-8192",
        tools,
      },
      inputs: [undefined, "appendedMessages"],
    },
    output: {
      // This node displays the responce to the user.
      agent: (answer: string) => console.log(`Llama3: ${answer}\n`),
      inputs: ["groq.choices.$0.message.content"],
      if: "groq.choices.$0.message.content",
    },
    pushFirstResponce: {
      // This node append the responce to the messages.
      agent: "pushAgent",
      inputs: ["appendedMessages", "groq.choices.$0.message"],
    },

    tool_calls: {
      agent: "nestedAgent",
      inputs: ["groq.choices.$0.message.tool_calls", "pushFirstResponce"],
      if: "groq.choices.$0.message.tool_calls",
      graph: {
        nodes: {
          urlPoints: {
            // Build a URL to fetch "points" fro the spcified latitude and longitude
            agent: (args: any) => {
              const { latitude, longitude } = JSON.parse(args);
              const url = `https://api.weather.gov/points/${latitude},${longitude}`;
              console.log(url);
              return url;
            },
            inputs: ["$0.$0.function.arguments"]
          },
          fetchPoints: {
            // Get "points" from the URL.
            agent: "fetchAgent",
            inputs: ["urlPoints", undefined, {"User-Agent": "(receptron.org)"}],
          },
          fetchForecast: {
            // Get the weather forecast for that points.
            agent: "fetchAgent",
            params: {
              type: 'text'
            },
            inputs: ["fetchPoints.properties.forecast", undefined, {"User-Agent": "(receptron.org)"}],
            if: "fetchPoints.properties.forecast"
          },
          toolMessage: {
            // Build a message from the tool
            agent: (info:any, res:any) => ({
              "tool_call_id": info.id,
              "role": "tool",
              "name": info.function.name,
              "content": res,
            }),
            inputs: ["$0.$0", "fetchForecast"]
          },
          pushToolResponce: {
            // This node append that message to the messages.
            agent: "pushAgent",
            inputs: ["$1", "toolMessage"],
          },
          groq2: {
            // This node sends those messages to Llama3 on groq to get the answer.
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192",
            },
            inputs: [undefined, "pushToolResponce"],
          },
          output2: {
            agent: (answer: string) => console.log(`Llama3': ${answer}\n`),
            inputs: ["groq2.choices.$0.message.content"],
          },
          pushSecondResponse: {
            // This node append the responce to the messages.
            agent: "pushAgent",
            inputs: ["pushToolResponce", "groq2.choices.$0.message"],
            isResult: true,
          },
        }
      },
    },
    no_tool_calls: {
      // This node is activated only if this is not a tool responce.
      agent: "copyAgent",
      if: "groq.choices.$0.message.content",
      inputs: ["pushFirstResponce"]
    },

    reducerAll: {
      agent: "copyAgent",
      anyInput: true,
      inputs: ["no_tool_calls", "tool_calls.pushSecondResponse"],
    }
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(
    __filename,
    graph_data,
    {
      groqAgent,
      copyAgent,
      nestedAgent,
      fetchAgent,
    },
    () => {},
    false,
  );
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
