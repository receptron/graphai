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
      update: "reducer",
      isResult: true,
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
    messagesWithUserInput: {
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
      inputs: [undefined, "messagesWithUserInput"],
    },
    output: {
      // This node displays the responce to the user.
      agent: (answer: string) => console.log(`Llama3: ${answer}\n`),
      inputs: ["groq.choices.$0.message.content"],
      if: "groq.choices.$0.message.content",
    },
    messagesWithFirstRes: {
      // This node append the responce to the messages.
      agent: "pushAgent",
      inputs: ["messagesWithUserInput", "groq.choices.$0.message"],
    },

    tool_calls: {
      agent: "nestedAgent",
      inputs: ["groq.choices.$0.message.tool_calls", "messagesWithFirstRes"],
      if: "groq.choices.$0.message.tool_calls",
      graph: {
        version: 0.2,
        nodes: {
          urlPoints: {
            // Build a URL to fetch "points" fro the spcified latitude and longitude
            agent: (args: any) => {
              const { latitude, longitude } = JSON.parse(args);
              return `https://api.weather.gov/points/${latitude},${longitude}`;
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
          messagesWithToolRes: {
            // This node append that message to the messages.
            agent: "pushAgent",
            inputs: ["$1", "toolMessage"],
          },
          groq: {
            // This node sends those messages to Llama3 on groq to get the answer.
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192",
            },
            inputs: [undefined, "messagesWithToolRes"],
          },
          output: {
            agent: (answer: string) => console.log(`Llama3: ${answer}\n`),
            inputs: ["groq.choices.$0.message.content"],
          },
          messagesWithSecondRes: {
            // This node append the responce to the messages.
            agent: "pushAgent",
            inputs: ["messagesWithToolRes", "groq.choices.$0.message"],
            isResult: true,
          },
        }
      },
    },
    no_tool_calls: {
      // This node is activated only if this is not a tool responce.
      agent: "copyAgent",
      if: "groq.choices.$0.message.content",
      inputs: ["messagesWithFirstRes"]
    },

    reducer: {
      agent: "copyAgent",
      anyInput: true,
      inputs: ["no_tool_calls", "tool_calls.messagesWithSecondRes"],
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
