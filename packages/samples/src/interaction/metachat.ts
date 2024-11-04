import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as llm_agents from "@graphai/llm_agents";
import * as agents from "@graphai/agents";

export const graph_data = {
  version: 0.5,
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
      inputs: { url: "https://raw.githubusercontent.com/receptron/graphai/refs/heads/main/packages/samples/graph_data/openai/reception.yaml" },
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
      inputs: {
        prompt: "Name, Address and Phone Number",
        messages: [
          {
            // System message, which gives the specification of GraphAI, and instruct to generate a graphAI graph dynamically.
            role: "system",
            content:
              "You an expert in GraphAI programming. You are responsible in generating a graphAI graph to get required information from the user.\n" +
              "graphAI graph outputs in json format\n" +
              "[documation of GraphAI]\n${:document}",
          },
          {
            // Sample question, which specifies which information we need to get from the user.
            role: "user",
            content: "Name, Date of Birth and Gendar",
          },
          {
            // Sample AI agent graph, which acquires those information from the user.
            role: "assistant",
            content: "```json\n${:sampleGraph}\n```\n",
          },
        ],
      },
    },
    executer: {
      // Execute that AI Agent
      agent: "nestedAgent",
      graph: ":graphGenerator.text.codeBlock().jsonParse()",
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
