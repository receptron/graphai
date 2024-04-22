import "dotenv/config";

import { AgentFunction } from "@/graphai";

import { graphDataTestRunner } from "~/utils/runner";
import { wikipediaAgent } from "./agents/wikipedia";
import { stringEmbeddingsAgent, stringSplitterAgent, stringTemplateAgent, slashGPTAgent } from "@/experimental_agents";
import { get_encoding } from "tiktoken";

export const cosineSimilarityAgent: AgentFunction<
  {
    inputKey?: string;
  },
  {
    contents: Array<number>;
  }
> = async ({ params, inputs }) => {
  const embeddings: Array<Array<number>> = inputs[0][params.inputKey ?? "contents"];
  const reference: Array<number> = inputs[1][params.inputKey ?? "contents"][0];
  const contents = embeddings.map((embedding) => {
    return embedding.reduce((dotProduct: number, value, index) => {
      return dotProduct + value * reference[index];
    }, 0);
  });
  return { contents };
};

export const sortByValuesAgent: AgentFunction<
  {
    inputKey?: string;
  },
  {
    contents: Array<any>;
  }
> = async ({ params, inputs }) => {
  const sources: Array<any> = inputs[0][params.inputKey ?? "contents"];
  const values: Array<any> = inputs[1][params.inputKey ?? "contents"];
  const joined = sources.map((item, index) => {
    return { item, value: values[index] };
  });
  const contents = joined
    .sort((a, b) => {
      return b.value - a.value; // Descendant
    })
    .map((a) => {
      return a.item;
    });
  return { contents };
};

export const tokenBoundStringsAgent: AgentFunction<
  {
    inputKey?: string;
    limit?: number;
  },
  {
    content: string;
  }
> = async ({ params, inputs }) => {
  const enc = get_encoding("cl100k_base");
  const contents: Array<string> = inputs[0][params?.inputKey ?? "contents"];
  const limit = params?.limit ?? 5000;
  const addNext = (total: number, index: number): number => {
    const length = enc.encode(contents[index]).length;
    if (total + length < limit && index + 1 < contents.length) {
      return addNext(total + length, index + 1);
    }
    return index + 1;
  };
  const endIndex = addNext(0, 0);
  const content = contents
    .filter((value, index) => {
      return index < endIndex;
    })
    .join("\n");
  return { content, endIndex };
};

const graph_data = {
  nodes: {
    source: {
      value: {
        name: "Sam Bankman-Fried",
        topic: "sentence by the court",
        content: "describe the final sentence by the court for Sam Bank-Fried",
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
      agentId: "cosineSimilarityAgent",
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
      inputs: ["source", "referenceText"],
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
      inputs: ["source"],
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
    cosineSimilarityAgent,
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
