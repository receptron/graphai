import "dotenv/config";
import { graphDataTestRunner } from "@graphai/test_utils";
import * as llm_agents from "@/index";
import * as agents from "@graphai/agents";

export const graph_data = {
  version: 0.3,
  nodes: {
    document: {
      agent: "fetchAgent",
      console: {
        before: "...fetching document",
      },
      params: {
        type: "text",
      },
      inputs: { url: "https://raw.githubusercontent.com/receptron/graphai/main/packages/graphai/README.md" },
    },
    sampleGraph: {
      agent: "fetchAgent",
      console: {
        before: "...fetching sample graph",
      },
      params: {
        type: "text",
      },
      inputs: { url: "https://raw.githubusercontent.com/receptron/graphai/main/packages/samples/data/reception2.json" },
    },
    messages: {
      agent: "stringTemplateAgent",
      params: {
        template: [
          {
            // System message, which gives the specification of GraphAI, and instruct to generate a graphAI graph dynamically.
            role: "system",
            content:
              "You an expert in GraphAI programming. You are responsible in generating a graphAI graph to get required information from the user.\n" +
              "[documation of GraphAI]\n${0}",
          },
          {
            // Sample question, which specifies which information we need to get from the user.
            role: "user",
            content: "Name, Date of Birth and Gendar",
          },
          {
            // Sample AI agent graph, which acquires those information from the user.
            role: "assistant",
            content: "```json\n${1}\n```\n",
          },
        ],
      },
      inputs: [":document", ":sampleGraph"],
    },
    graphGenerator: {
      // Generates a graph for an AI agent to acquire specified information from the user.
      agent: "openAIAgent",
      console: {
        before: "...generating a new graph",
      },
      params: {
        model: "gpt-4o",
      },
      inputs: { prompt:"Name, Address and Phone Number", messages:":messages" },
    },
    parser: {
      // Parses the JSON data in the returned message
      agent: "jsonParserAgent",
      inputs: [":graphGenerator.choices.$0.message.content"],
    },
    executer: {
      // Execute that AI Agent
      agent: "nestedAgent",
      graph: ":parser",
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { ...agents, ...llm_agents }, () => {}, false);
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
