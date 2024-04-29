import { AgentFunction } from "@/graphai";

// Type for OpenAI's Embedding API
interface EmbeddingResponse {
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
}

const defaultEmbeddingModel = "text-embedding-3-small";
const OpenAI_embedding_API = "https://api.openai.com/v1/embeddings";

// This agent retrieves embedding vectors for an array of strings using OpenAI's API
//
// Parameters:
//   model: Specifies the model (default is "text-embedding-3-small")
// Inputs:
//   inputs[0]: Array<string>
// Result:
//   contents: Array<Array<number>>
//
export const stringEmbeddingsAgent: AgentFunction<
  {
    model?: string;
  },
  any,
  Array<string> | string
> = async ({ params, inputs }) => {
  const input = inputs[0];
  const sources: Array<string> = Array.isArray(input) ? input : [input];
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY key is not set in environment variables.");
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const response = await fetch(OpenAI_embedding_API, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      input: sources,
      model: params?.model ?? defaultEmbeddingModel,
    }),
  });
  const jsonResponse: EmbeddingResponse = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const embeddings = jsonResponse.data.map((object) => {
    return object.embedding;
  });
  return embeddings;
};

const stringEmbeddingsAgentInfo = {
  name: "stringEmbeddingsAgent",
  agent: stringEmbeddingsAgent,
  mock: stringEmbeddingsAgent,
  samples: [],
  description: "Embeddings Agent",
  category: [],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default stringEmbeddingsAgentInfo;
