import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as llm_agents from "@/index";
import * as agents from "@graphai/agents";

const graph_data = {
  version: 0.5,
  nodes: {
    interactiveInputAgent: {
      agent: "textInputAgent",
    },
    wikipedia: {
      inputs: { query: ":interactiveInputAgent" },
      agent: "wikipediaAgent",
      params: {
        lang: "ja",
      },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", "sample_wiki.log", graph_data, { ...agents, ...llm_agents });
  console.log(result.wikipedia);
  console.log("COMPLETE 1");
};
if (process.argv[1] === __filename) {
  main();
}
