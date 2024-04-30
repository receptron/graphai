import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { sleeperAgent, gloqAgent } from "@/experimental_agents";

const graph_data = {
  nodes: {
    query: {
      agentId: "gloqAgent",
      params: {
        model: "foo"
      },
      isResult: true,
    },
    answer: {
      agentId: "sleeperAgent",
      inputs: ["query.choices.$0.message"]
    },
  }
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { gloqAgent, sleeperAgent });
  console.log(result);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
