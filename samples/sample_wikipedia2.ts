import "dotenv/config";
import * as dotenv from 'dotenv';

import { AgentFunction } from "@/graphai";

import { graphDataTestRunner } from "~/utils/runner";
import { wikipediaAgent } from "./agents/wikipedia";
import { stringTemplateAgent, slashGPTAgent } from "@/experimental_agents";

// see example
//  tests/agents/test_string_agent.ts
export const stringSplitterAgent: AgentFunction<
  {
    chunkSize?: number;
    overlap?: number;
    inputKey?: string;
  },
  {
    contents: Array<string>;
  }
> = async ({ params, inputs }) => {
  const source: string = inputs[0][params.inputKey ?? "content"];
  const chunkSize = params.chunkSize ?? 2048;
  const overlap = params.overlap ?? Math.floor(chunkSize / 8);
  const count = Math.floor(source.length / (chunkSize - overlap)) + 1;
  const contents = new Array(count).fill(undefined).map((_, i) => {
    const startIndex = i * (chunkSize - overlap);
    return source.substring(startIndex, startIndex + chunkSize);
  });

  return { contents, count, chunkSize, overlap };
};

interface EmbeddingResponse {
  object: string;
  model: string;
  usage: {
      prompt_tokens: number;
      total_tokens: number;
  };
  data: [{
    object: string;
    index: number;
    embedding: number[];
  }];
}

export const stringEmbeddingsAgent: AgentFunction<
  {
    inputKey?: string;
    model?: string;
  },
  {
    contents: any;
  }
> = async ({ params, inputs }) => {
  const input = inputs[0][params?.inputKey ?? "contents"];
  const sources: Array<string> = Array.isArray(input) ? input : [input];
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
      throw new Error('API key is not set in environment variables.');
  }  
  const url = 'https://api.openai.com/v1/embeddings';
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
        input: sources,
        model: params?.model ?? "text-embedding-3-small"
    })
  });
  const jsonResponse: EmbeddingResponse = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const embeddings = jsonResponse.data.map((object) => { return object.embedding; });
  return { contents: embeddings };
};

export const cosineSimilarityAgent: AgentFunction<
  {
    inputKey?: string;
  },
  {
    hello: string;
    // contents: Array<string>;
  }
> = async ({ params, inputs }) => {
  const embeddings: Array<Array<number>> = inputs[0][params.inputKey ?? "contents"];
  const reference: Array<number> = inputs[1][params.inputKey ?? "contents"][0];
  const contents = embeddings.map((embedding) => {
    return embedding.reduce((dotProduct:number, value, index) => {
      return dotProduct + value * reference[index];
    }, 0);
  });
  console.log("***", contents);
  return { hello: "hello" };
};

const graph_data = {
  nodes: {
    source: {
      value: {
        name: "Sam Bankman-Fried",
        topic: "sentence by the court"
      },
    },
    wikipedia: {
      agentId: "wikipediaAgent",
      inputs: ["source"],
      params: {
        inputKey: "name",
        lang: "en",
      },
    },
    chunks: {
      agentId: "stringSplitterAgent",
      inputs: ["wikipedia"]
    },
    embeddings: {
      agentId: "stringEmbeddingsAgent",
      inputs: ["chunks"]
    },
    topicEmbedding: {
      agentId: "stringEmbeddingsAgent",
      inputs: ["source"],
      params: {
        inputKey: "topic",
      },
    },
    similarityCheck: {
      agentId: "cosineSimilarityAgent",
      inputs: ["embeddings", "topicEmbedding"]
    }
    /*
    queryBuilder: {
      agentId: "stringTemplateAgent",
      inputs: ["title", "wikipedia"],
      params: {
        template: "下の情報を使って${0}についての最新の情報を書いて。\n\n${1}",
      },
    },
    query: {
      agentId: "slashGPTAgent",
      inputs: ["queryBuilder"]      
    }
    */
  },
};

const main = async () => {
  const result = await graphDataTestRunner("sample_wiki.log", graph_data, { cosineSimilarityAgent, stringEmbeddingsAgent, stringSplitterAgent, stringTemplateAgent, slashGPTAgent, wikipediaAgent });
  console.log(result.topicEmbedding);
  console.log("COMPLETE 1");
};
if (process.argv[1] === __filename) {
  main();
}
