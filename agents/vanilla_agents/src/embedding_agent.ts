import { AgentFunction, AgentFunctionInfo } from "graphai";

// Type for OpenAI's Embedding API
type OpenAIEmbeddingResponse = {
  object: string;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
  data: [
    {
      object: string;
      index: number;
      embedding: number[];
    },
  ];
};

type OllamaEmbeddingResponse = {
  model: string;
  embeddings: number[][];
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
};

// https://ollama.com/blog/embedding-models
type EmbeddingAIParams = {
  baseURL?: string;
  apiKey?: string;
  model?: string;
};

const defaultEmbeddingModel = "text-embedding-3-small";
const OpenAI_embedding_API = "https://api.openai.com/v1/embeddings";

// This agent retrieves embedding vectors for an array of strings using OpenAI's API
//
// Parameters:
//   model: Specifies the model (default is "text-embedding-3-small")
// NamedInputs:
//   array: Array<string>
//   item: string,
// Result:
//   contents: Array<Array<number>>
//
export const stringEmbeddingsAgent: AgentFunction<EmbeddingAIParams, number[][], { array: Array<string>; item: string }, EmbeddingAIParams> = async ({
  params,
  namedInputs,
  config,
}) => {
  const { array, item } = namedInputs;
  const { apiKey, model, baseURL } = {
    ...(config || {}),
    ...params,
  };

  const url = baseURL ?? OpenAI_embedding_API;
  const theModel = model ?? defaultEmbeddingModel;

  const openAIKey = apiKey ?? process.env.OPENAI_API_KEY;
  const headers = {
    "Content-Type": "application/json",
    Authorization: openAIKey ? `Bearer ${openAIKey}` : "",
  };

  const sources = array ?? [item];

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      input: sources,
      model: theModel,
    }),
  });
  const jsonResponse: OpenAIEmbeddingResponse | OllamaEmbeddingResponse = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if ("data" in jsonResponse) {
    // maybe openAI
    return jsonResponse.data.map((object) => {
      return object.embedding;
    });
  }
  if ("embeddings" in jsonResponse) {
    // ollama
    return jsonResponse.embeddings;
  }
};

const stringEmbeddingsAgentInfo: AgentFunctionInfo = {
  name: "stringEmbeddingsAgent",
  agent: stringEmbeddingsAgent,
  mock: stringEmbeddingsAgent,
  samples: [],
  description: "Embeddings Agent",
  category: ["embedding"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default stringEmbeddingsAgentInfo;
