import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@/index";
import { copyAgent } from "@graphai/agents";

const query = "What is bitcoin?";

const graph_data = {
  version: 0.3,
  nodes: {
    query: {
      agent: "geminiAgent",
      inputs: {
        prompt: query,
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
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { copyAgent, ...agents });
  console.log(result.result);
};

if (process.argv[1] === __filename) {
  main();
}
