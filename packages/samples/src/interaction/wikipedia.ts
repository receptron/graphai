import "dotenv/config";

import { graphDataTestRunner } from "@/utils/test_runner";
import { wikipediaAgent, textInputAgent } from "graphai/lib/experimental_agents";

const graph_data = {
  version: 0.3,
  nodes: {
    interactiveInputAgent: {
      agent: "textInputAgent",
    },
    wikipedia: {
      inputs: [":interactiveInputAgent"],
      agent: "wikipediaAgent",
      params: {
        lang: "ja",
      },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner("sample_wiki.log", graph_data, { textInputAgent, wikipediaAgent });
  console.log(result.wikipedia);
  console.log("COMPLETE 1");
};
if (process.argv[1] === __filename) {
  main();
}
