import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { copyAgent, geminiAgent } from "@/experimental_agents";

const query = "hello";

const graph_data = {
  version: 0.3,
  nodes: {
    query: {
      agent: "geminiAgent",
      params: {
        query,
      },
    },
    result: {
      agent: "copyAgent",
      inputs: [":query.choices.$0.message"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { geminiAgent, copyAgent });
  console.log(result.result);
};

if (process.argv[1] === __filename) {
  main();
}
