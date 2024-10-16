import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as llm_agents from "@graphai/llm_agents";
import * as service_agents from "@graphai/service_agents";
import * as vanilla from "@graphai/vanilla";

export const graph_data = {
  version: 0.5,
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
      console: {
        before: "...fetching data from wikkpedia",
      },
      agent: "wikipediaAgent",
      inputs: { query: ":source.name" },
      params: {
        lang: "en",
      },
    },
    chunks: {
      // Break that article into chunks
      console: {
        before: "...splitting the article into chunks",
      },
      agent: "stringSplitterAgent",
      inputs: { text: ":wikipedia.content" },
    },
    embeddings: {
      // Get embedding vectors of those chunks
      console: {
        before: "...fetching embeddings for chunks",
      },
      agent: "stringEmbeddingsAgent",
      inputs: { item: ":chunks.contents" },
    },
    topicEmbedding: {
      // Get embedding vector of the topic
      console: {
        before: "...fetching embedding for the topic",
      },
      agent: "stringEmbeddingsAgent",
      inputs: { item: ":source.topic" },
    },
    similarityCheck: {
      // Get the cosine similarities of those vectors
      agent: "dotProductAgent",
      inputs: { matrix: ":embeddings", vector: ":topicEmbedding.$0" },
    },
    sortedChunks: {
      // Sort chunks based on those similarities
      agent: "sortByValuesAgent",
      inputs: { array: ":chunks.contents", values: ":similarityCheck" },
    },
    referenceText: {
      // Generate reference text from those chunks (token limited)
      agent: "tokenBoundStringsAgent",
      inputs: { chunks: ":sortedChunks" },
      params: {
        limit: 5000,
      },
    },
    prompt: {
      // Generate a prompt with that reference text
      agent: "stringTemplateAgent",
      inputs: { q: ":source.query", c: ":referenceText.content" },
      params: {
        template: "Using the following document, ${c}\n\n${q}",
      },
    },
    RagQuery: {
      // Get the answer from LLM with that prompt
      console: {
        before: "...performing the RAG query",
      },
      agent: "openAIAgent",
      inputs: { prompt: ":prompt" },
    },
    OneShotQuery: {
      // Get the answer from LLM without the reference text
      agent: "openAIAgent",
      inputs: { prompt: ":source.query" },
    },
    RagResult: {
      agent: "copyAgent",
      inputs: { result: ":RagQuery.choices.$0.message.content" },
      isResult: true,
    },
    OneShotResult: {
      agent: "copyAgent",
      inputs: { result: ":OneShotQuery.choices.$0.message.content" },
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(
    __dirname + "/../",
    "sample_wiki.log",
    graph_data,
    { ...service_agents, ...vanilla, ...llm_agents },
    () => {},
    false,
  );
  console.log(result);
};
if (process.argv[1] === __filename) {
  main();
}
