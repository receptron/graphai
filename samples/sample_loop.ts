import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { pushAgent, shiftAgent, slashGPTAgent, totalAgent } from "@/experimental_agents";

const graph_data = {
  loop: {
    while: "people",
  },
  nodes: {
    people: {
      value: ["Steve Jobs", "Elon Musk", "Nikola Tesla"],
      update: "retriever.array",
    },
    result: {
      value: [],
      update: "reducer2",
    },
    usage: {
      value: {},
      update: "acountant",
    },
    retriever: {
      agentId: "shiftAgent",
      inputs: ["people"],
    },
    query: {
      agentId: "slashGPTAgent",
      params: {
        manifest: {
          prompt: "Describe about the person in less than 100 words",
        },
      },
      inputs: ["retriever.item"],
    },
    reducer1: {
      agentId: "popAgent",
      inputs: ["query"],
    },
    reducer2: {
      agentId: "pushAgent",
      inputs: ["result", "reducer1.item"],
    },
    usageData: {
      agentId: "totalAgent",
      inputs: ["reducer2.$0"],
    },
    acountant: {
      agentId: "totalAgent",
      inputs: ["usage", "usageData.usage"],
    },
  },
};

const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { pushAgent, shiftAgent, slashGPTAgent, totalAgent });
  console.log(result.result);
  console.log(result.usage);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
