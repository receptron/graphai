import "dotenv/config";
import { graphDataTestRunner } from "@/utils/test_runner";
import * as agents from "@graphai/agents";

const query =
  "I'd like to write a paper about data flow programming for AI application, which involves multiple asynchronous calls, some of operations are done on other machines (distributed computing). Please come up with the title and an abstract for this paper.";

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
      inputs: [":query.content"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, agents);
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
