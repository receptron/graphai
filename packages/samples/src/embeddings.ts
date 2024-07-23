import "dotenv/config";

import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

const graph_data = {
  version: 0.5,
  nodes: {
    strings: {
      value: ["王", "女王", "貴族", "男", "女", "庶民", "農民"],
      isResult: true,
    },
    embeddings: {
      agent: "stringEmbeddingsAgent",
      inputs: [":strings"],
    },
    similarities: {
      agent: "mapAgent",
      inputs: { rows: ":embeddings", embeddings: ":embeddings" },
      graph: {
        nodes: {
          result: {
            agent: "dotProductAgent",
            inputs: { matrix: ":embeddings", vector: ":row" },
            isResult: true,
          },
        },
      },
      isResult: true,
    },
  },
};

const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, agents, undefined, false);
  console.log(result.similarities);
};
if (process.argv[1] === __filename) {
  main();
}
