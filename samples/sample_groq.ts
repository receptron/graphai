import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { sleeperAgent, gloqAgent } from "@/experimental_agents";

const query =
  "I'd like to write a paper about data flow programming for AI application, which involves multiple asynchronous calls, some of operations are done on other machines (distributed computing). Please come up with the title and an abstract for this paper.";

const graph_data = {
  nodes: {
    query: {
      agent: "gloqAgent",
      params: {
        model: "mixtral-8x7b-32768",
        query,
      },
      isResult: true,
    },
    answer: {
      agent: "sleeperAgent",
      inputs: ["query.choices.$0.message"],
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { gloqAgent, sleeperAgent });
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
