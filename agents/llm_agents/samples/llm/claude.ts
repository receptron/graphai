import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@/index";
import { sleeperAgent } from "@graphai/agents";

const query = "Hello!";

const graph_data = {
  version: 0.5,
  nodes: {
    query: {
      agent: "anthropicAgent",
      inputs: {
        prompt: query,
      },
      isResult: true,
    },
    answer: {
      agent: "sleeperAgent",
      inputs: [":query.choices.$0.message"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { sleeperAgent, ...agents });
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
