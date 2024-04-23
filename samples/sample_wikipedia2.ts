import "dotenv/config";

import { graphDataTestRunner } from "~/utils/runner";
import { wikipediaAgent } from "./agents/wikipedia";
import {
  tokenBoundStringsAgent,
  sortByValuesAgent,
  dotProductAgent,
  stringEmbeddingsAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  slashGPTAgent,
} from "@/experimental_agents";

const graph_data = {
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
      inputs: ["source"],
      params: {
        inputKey: "name",
        lang: "en",
      },
    },
    chunks: {
      // Break that article into chunks
      agentId: "stringSplitterAgent",
      inputs: ["wikipedia"],
    },
    embeddings: {
      // Get embedding vectors of those chunks
      agentId: "stringEmbeddingsAgent",
      inputs: ["chunks"],
    },
    topicEmbedding: {
      // Get embedding vector of the topic
      agentId: "stringEmbeddingsAgent",
      inputs: ["source"],
      params: {
        inputKey: "topic",
      },
    },
    similarityCheck: {
      // Get the cosine similarities of those vectors
      agentId: "dotProductAgent",
      inputs: ["embeddings", "topicEmbedding"],
    },
    sortedChunks: {
      // Sort chunks based on those similarities
      agentId: "sortByValuesAgent",
      inputs: ["chunks", "similarityCheck"],
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
      inputs: ["prompt.content"],
    },
    OneShotQuery: {
      // Get the answer from LLM without the reference text
      agentId: "slashGPTAgent",
      inputs: ["source.query"],
    },
  },
};

const simplify = (result: any) => {
  const { content, usage } = result;
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
  console.log(simplify(result.OneShotQuery));
  console.log(simplify(result.RagQuery));
};
if (process.argv[1] === __filename) {
  main();
}
