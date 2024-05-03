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
  version: 0.2,
  nodes: {
    source: {
      value: {
        name: "Sam Bankman-Fried",
        topic: "sentence by the court",
        query: "describe the final sentence by the court for Sam Bank-Fried",
      },
    },
    wikipedia: {
      // Fetch an article from Wikipedia
      agentId: "wikipediaAgent",
      inputs: ["source.name"],
      params: {
        lang: "en",
      },
    },
    chunks: {
      // Break that article into chunks
      agentId: "stringSplitterAgent",
      inputs: ["wikipedia.content"],
    },
    embeddings: {
      // Get embedding vectors of those chunks
      agentId: "stringEmbeddingsAgent",
      inputs: ["chunks.contents"],
    },
    topicEmbedding: {
      // Get embedding vector of the topic
      agentId: "stringEmbeddingsAgent",
      inputs: ["source.topic"],
    },
    similarityCheck: {
      // Get the cosine similarities of those vectors
      agentId: "dotProductAgent",
      inputs: ["embeddings", "topicEmbedding"],
    },
    sortedChunks: {
      // Sort chunks based on those similarities
      agentId: "sortByValuesAgent",
      inputs: ["chunks.contents", "similarityCheck"],
    },
    referenceText: {
      // Generate reference text from those chunks (token limited)
      agentId: "tokenBoundStringsAgent",
      inputs: ["sortedChunks"],
      params: {
        limit: 5000,
      },
    },
    prompt: {
      // Generate a prompt with that reference text
      agentId: "stringTemplateAgent",
      inputs: ["source.query", "referenceText.content"],
      params: {
        template: "Using the following document, ${0}\n\n${1}",
      },
    },
    RagQuery: {
      // Get the answer from LLM with that prompt
      agentId: "slashGPTAgent",
      inputs: ["prompt"],
    },
    OneShotQuery: {
      // Get the answer from LLM without the reference text
      agentId: "slashGPTAgent",
      inputs: ["source.query"],
    },
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
  });
  console.log(simplify(result.OneShotQuery as Array<any>));
  console.log(simplify(result.RagQuery as Array<any>));
};
if (process.argv[1] === __filename) {
  main();
}
