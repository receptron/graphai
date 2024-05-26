import "dotenv/config";
import { graphDataTestRunner } from "@/utils/test_runner";
import * as agents from "@graphai/agents";
import * as sample from "./reception";

export const graph_data = {
  version: 0.3,
  nodes: {
    document: {
      agent: "fetchAgent",
      params: {
        type: "text"
      },
      inputs:["https://raw.githubusercontent.com/receptron/graphai/main/README.md"]
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
              content: "```json\n${1}```\n",
            },
          ]
      },
      inputs: [":document", JSON.stringify(sample.graph_data)]
    },
    graphGenerator: {
      // Generates a graph for an AI agent to acquire specified information from the user.
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
      },
      inputs: ["Name, Address and Phone Number", ":messages"],
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
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, agents, () => {}, false);
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
