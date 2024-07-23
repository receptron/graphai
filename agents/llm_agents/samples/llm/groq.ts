import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import { sleeperAgent } from "@graphai/agents";
import * as agents from "@/index";

const query =
  "I'd like to write a paper about data flow programming for AI application, which involves multiple asynchronous calls, some of operations are done on other machines (distributed computing). Please come up with the title and an abstract for this paper.";

const graph_data = {
  version: 0.5,
  nodes: {
    query: {
      agent: "groqAgent",
      params: {
        model: "mixtral-8x7b-32768",
      },
      isResult: true,
      inputs: {
        prompt: query,
      },
    },
    answer: {
      agent: "sleeperAgent",
      inputs: [":query.choices.$0.message"],
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
