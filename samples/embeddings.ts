import "dotenv/config";

import { graphDataTestRunner } from "~/utils/runner";
import {
  tokenBoundStringsAgent,
  sortByValuesAgent,
  dotProductAgent,
  stringEmbeddingsAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  slashGPTAgent,
  wikipediaAgent,
} from "@/experimental_agents";

const graph_data = {
  version: 0.3,
  nodes: {
    strings: {
      value: [
        "王", "女王", "貴族", "男", "女", "庶民", "農民"
      ],
      isResult: true,
    },
    embeddings: {
      agent: "stringEmbeddingsAgent",
      inputs: [":strings"],
    },
    similarities: {
      agent: "mapAgent",
      inputs: [":embeddings", ":embeddings"],
      graph: {
        nodes: {
          result: {
            agent: "dotProductAgent",
            inputs: [":$1", ":$0"],
            isResult: true,
          }
        }
      },
      isResult: true
    }
  },
};

const simplify = (result: Array<any>) => {
  const { content, usage } = result[result.length - 1];
  return { content, usage };
};

const main = async () => {
  const result = await graphDataTestRunner("sample_wiki.log", graph_data, {
    tokenBoundStringsAgent,
    sortByValuesAgent,
    dotProductAgent,
    stringEmbeddingsAgent,
    stringSplitterAgent,
    stringTemplateAgent,
    slashGPTAgent,
    wikipediaAgent,
  }, undefined, false);
  console.log(result.similarities);
};
if (process.argv[1] === __filename) {
  main();
}
