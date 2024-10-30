import "dotenv/config";

import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

const graph_data = {
  version: 0.5,
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
      update: ":reducer2.array",
    },
    retriever: {
      agent: "shiftAgent",
      inputs: { array: ":people" },
    },
    query: {
      agent: "slashGPTAgent",
      params: {
        manifest: {
          prompt: "Describe about the person in less than 100 words",
        },
      },
      inputs: { array: [":retriever.item"] },
    },
    reducer1: {
      agent: "popAgent",
      inputs: { array: ":query" },
    },
    reducer2: {
      agent: "pushAgent",
      inputs: { array: ":result", item: ":reducer1.item" },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, agents);
  console.log(result.result);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
