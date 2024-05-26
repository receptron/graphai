import "dotenv/config";
import { graphDataTestRunner } from "@/utils/test_runner";
import * as agents from "@graphai/agents";

const query = "Hello!";

const graph_data = {
  version: 0.3,
  nodes: {
    query: {
      agent: "anthropicAgent",
      params: {
        query,
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
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, agents);
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
