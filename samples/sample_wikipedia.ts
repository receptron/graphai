import "dotenv/config";

import { graphDataTestRunner } from "~/utils/runner";
import { interactiveInputTextAgent } from "./agents/interactiveInputAgent";
import { wikipediaAgent } from "./agents/wikipedia";

const graph_data = {
  nodes: {
    interactiveInputAgent: {
      agentId: "interactiveInputTextAgent",
    },
    wikipedia: {
      inputs: ["interactiveInputAgent"],
      agentId: "wikipediaAgent",
      params: {
        inputKey: "answer",
        lang: "ja",
      },
    },
  },
};

const main = async () => {
  const result = await graphDataTestRunner("sample_wiki.log", graph_data, { interactiveInputTextAgent, wikipediaAgent });
  console.log(result.wikipedia!.content);
  console.log(result.wikipedia!.candidates);
  console.log("COMPLETE 1");
};
if (process.argv[1] === __filename) {
  main();
}
