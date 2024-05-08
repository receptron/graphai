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
      value: [{ role: "system", content: "You are a meteorologist. Use getWeather API, only when the user ask for the weather information." }],
      update: "reducer",
      isResult: true,
    },
    userInput: {
      // Receives an input from the user.
      agent: () => input({ message: "You:" }),
    },
    checkInput: {
      // Checkes if the user wants to end the conversation.
      agent: (query: string) => query !== "/bye",
      inputs: ["userInput"],
    },
    messagesWithUserInput: {
      // Appends the user's input to the messages.
      agent: (messages: Array<any>, content: string) => [...messages, { role: "user", content }],
      inputs: ["messages", "userInput"],
      if: "checkInput",
    },
    groq: {
      // Sends those messages to LLM to get the answer.
      agent: "groqAgent",
      params: {
        model: "Llama3-8b-8192",
        tools,
      },
      inputs: [undefined, "messagesWithUserInput"],
    },
    output: {
      // Displays the response to the user.
      agent: (answer: string) => console.log(`Llama3: ${answer}\n`),
      inputs: ["groq.choices.$0.message.content"],
      if: "groq.choices.$0.message.content",
    },
    messagesWithFirstRes: {
      // Appends the response to the messages.
      agent: "pushAgent",
      inputs: ["messagesWithUserInput", "groq.choices.$0.message"],
    },

    tool_calls: {
      // This node is activated if the LLM requests a tool call.
      agent: "nestedAgent",
      inputs: ["groq.choices.$0.message.tool_calls", "messagesWithFirstRes"],
      if: "groq.choices.$0.message.tool_calls",
      graph: {
        // This graph is nested only for the readability.
        version: 0.2,
        nodes: {
          outputFetching: {
            agent: (args: any) => console.log(`... fetching weather info ${args}`),
            inputs: ["$0.$0.function.arguments"],
          },
          urlPoints: {
            // Builds a URL to fetch the "grid location" from the spcified latitude and longitude
            agent: (args: any) => {
              const { latitude, longitude } = JSON.parse(args);
              return `https://api.weather.gov/points/${latitude},${longitude}`;
            },
            inputs: ["$0.$0.function.arguments"],
          },
          fetchPoints: {
            // Fetches the "grid location" from the URL.
            agent: "fetchAgent",
            inputs: ["urlPoints", undefined, { "User-Agent": "(receptron.org)" }],
          },
          fetchForecast: {
            // Fetches the weather forecast for that location.
            agent: "fetchAgent",
            params: {
              type: "text",
            },
            inputs: ["fetchPoints.properties.forecast", undefined, { "User-Agent": "(receptron.org)" }],
            if: "fetchPoints.properties.forecast",
          },
          responceText: {
            agent: "copyAgent",
            anyInput: true,
            inputs: ["fetchForecast"],
          },
          toolMessage: {
            // Creates a tool message as the return value of the tool call.
            agent: (info: any, res: any) => ({
              tool_call_id: info.id,
              role: "tool",
              name: info.function.name,
              content: res,
            }),
            inputs: ["$0.$0", "responceText"],
          },
          filteredMessages: {
            // Removes previous tool messages to create a room.
            agent: (messages: any) => messages.filter((message: any) => message.role !== "tool"),
            inputs: ["$1"],
          },
          messagesWithToolRes: {
            // Appends that message to the messages.
            agent: "pushAgent",
            inputs: ["filteredMessages", "toolMessage"],
          },
          groq: {
            // Sends those messages to LLM to get the answer.
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192",
            },
            inputs: [undefined, "messagesWithToolRes"],
          },
          output: {
            // Displays the response to the user.
            agent: (answer: string) => console.log(`Llama3: ${answer}\n`),
            inputs: ["groq.choices.$0.message.content"],
          },
          messagesWithSecondRes: {
            // Appends the response to the messages.
            agent: "pushAgent",
            inputs: ["messagesWithToolRes", "groq.choices.$0.message"],
            isResult: true,
          },
        },
      },
    },
    no_tool_calls: {
      // This node is activated only if this is a normal response (not a tool call).
      agent: "copyAgent",
      if: "groq.choices.$0.message.content",
      inputs: ["messagesWithFirstRes"],
    },

    reducer: {
      // Receives messages from either case.
      agent: "copyAgent",
      anyInput: true,
      inputs: ["no_tool_calls", "tool_calls.messagesWithSecondRes"],
    },
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
