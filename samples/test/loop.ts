import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { pushAgent, shiftAgent, slashGPTAgent, totalAgent } from "@/experimental_agents/packages";

const graph_data = {
  version: 0.3,
  loop: {
    while: ":people",
  },
  nodes: {
    people: {
      value: ["Steve Jobs", "Elon Musk", "Nikola Tesla"],
      update: ":retriever.array",
    },
    result: {
      value: [],
      update: ":reducer2",
    },
    usage: {
      value: {},
      update: ":acountant",
    },
    retriever: {
      agent: "shiftAgent",
      inputs: [":people"],
    },
    query: {
      agent: "slashGPTAgent",
      params: {
        manifest: {
          prompt: "Describe about the person in less than 100 words",
        },
      },
      inputs: [":retriever.item"],
    },
    reducer1: {
      agent: "popAgent",
      inputs: [":query"],
    },
    reducer2: {
      agent: "pushAgent",
      inputs: [":result", ":reducer1.item"],
    },
    usageData: {
      agent: "totalAgent",
      inputs: [":reducer2.$0"],
    },
    acountant: {
      agent: "totalAgent",
      inputs: [":usage", ":usageData.usage"],
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { pushAgent, shiftAgent, slashGPTAgent, totalAgent });
  console.log(result.result);
  console.log(result.usage);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
