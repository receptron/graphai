import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

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

const graph_tool = {
  nodes: {
    outputFetching: {
      // Displays the fetching message.
      agent: "stringTemplateAgent",
      params: {
        template: "... fetching weather info: ${a}",
      },
      console: {
        after: true,
      },
      inputs: { a: "${:tool.arguments.latitude}, ${:tool.arguments.longitude}" },
    },
    fetchPoints: {
      // Fetches the "grid location" from the URL.
      agent: "fetchAgent",
      // Builds a URL to fetch the "grid location" from the spcified latitude and longitude
      inputs: { url: "https://api.weather.gov/points/${:tool.arguments.latitude},${:tool.arguments.longitude}", headers: { "User-Agent": "(receptron.org)" } },
    },
    fetchForecast: {
      // Fetches the weather forecast for that location.
      agent: "fetchAgent",
      params: {
        type: "text",
      },
      inputs: { url: ":fetchPoints.properties.forecast", headers: { "User-Agent": "(receptron.org)" } },
      unless: ":fetchPoints.onError",
    },
    extractError: {
      // Extract error title and detail
      agent: "stringTemplateAgent",
      params: {
        template: "${title}: ${error}",
      },
      inputs: { title: ":fetchPoints.onError.error.title", error: ":fetchPoints.onError.error.detail" },
      if: ":fetchPoints.onError",
    },
    responseText: {
      // Extract the forecast and error
      agent: "copyAgent",
      anyInput: true,
      inputs: { array: [":fetchForecast", ":extractError"] },
    },
    messagesWithToolRes: {
      // Appends that message to the messages.
      agent: "pushAgent",
      inputs: {
        array: ":messages",
        item: {
          role: "tool",
          tool_call_id: ":tool.id",
          name: ":tool.name",
          content: ":responseText.array.$0",
        },
      },
      // console: { after: true },
    },
    llmCall: {
      // Sends those messages to LLM to get the answer.
      agent: "openAIAgent",
      inputs: { messages: ":messagesWithToolRes" },
    },
    output: {
      // Displays the response to the user.
      agent: "stringTemplateAgent",
      params: {
        template: "Weather: ${m}",
      },
      console: {
        after: true,
      },
      inputs: { m: ":llmCall.text" },
    },
    messagesWithSecondRes: {
      // Appends the response to the messages.
      agent: "pushAgent",
      inputs: { array: ":messagesWithToolRes", item: ":llmCall.message" },
      isResult: true,
    },
  },
};

export const graph_data = {
  version: 0.5,
  loop: {
    while: ":continue",
  },
  nodes: {
    continue: {
      // Holds a boolean data if we need to continue this chat or not.
      value: true,
      update: ":checkInput",
    },
    messages: {
      // Holds the conversation, array of messages.
      value: [{ role: "system", content: "You are a meteorologist. Use getWeather API, only when the user ask for the weather information." }],
      update: ":reducer.array.$0",
      isResult: true,
    },
    userInput: {
      // Receives an input from the user.
      agent: "textInputAgent",
      params: {
        message: "Location:",
      },
    },
    checkInput: {
      // Checks if the user wants to terminate the chat or not.
      agent: "compareAgent",
      inputs: { array: [":userInput", "!=", "/bye"] },
    },
    llmCall: {
      // Sends those messages to LLM to get the answer.
      agent: "openAIAgent",
      params: {
        tools,
      },
      inputs: { messages: ":messages", prompt: ":userInput" },
      if: ":checkInput",
    },
    output: {
      // Displays the response to the user.
      agent: "stringTemplateAgent",
      params: {
        template: "Weather: ${m}",
      },
      console: {
        after: true,
      },
      inputs: { m: ":llmCall.text" },
      if: ":llmCall.text",
    },
    messagesWithFirstRes: {
      // Appends the response to the messages.
      agent: "pushAgent",
      inputs: {
        array: ":messages",
        items: [{ role: "user", content: ":userInput" }, ":llmCall.message"],
      },
    },
    tool_calls: {
      // This node is activated if the LLM requests a tool call.
      agent: "nestedAgent",
      inputs: { messages: ":messagesWithFirstRes", tool: ":llmCall.tool" },
      if: ":llmCall.tool",
      graph: graph_tool,
    },
    no_tool_calls: {
      // This node is activated only if this is a normal response (not a tool call).
      agent: "copyAgent",
      unless: ":llmCall.tool",
      inputs: { result: ":messagesWithFirstRes" },
    },
    reducer: {
      // Receives messages from either case.
      agent: "copyAgent",
      anyInput: true,
      inputs: { array: [":no_tool_calls.result", ":tool_calls.messages"] },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, agents, () => {}, false);
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
