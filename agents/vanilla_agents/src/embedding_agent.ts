import { AgentFunction, AgentFunctionInfo } from "graphai";

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
// NamedInputs:
//   array: Array<string>
//   item: string,
// Result:
//   contents: Array<Array<number>>
//
export const stringEmbeddingsAgent: AgentFunction<
  {
    model?: string;
  },
  number[][],
  { array: Array<string>; item: string }
> = async ({ params, namedInputs }) => {
  const { array, item } = namedInputs;

  const sources = array ?? [item];
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY key is not set in environment variables.");
  }
  const headers = {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${apiKey}`,
  };

  console.log("Sending to embeddings:", sources);

  const response = await fetch("http://localhost:11434/v1/embeddings", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      input: sources,
      model: "nomic-embed-text",
    }),
  });
  const jsonResponse: EmbeddingResponse = await response.json();
  console.log("nomic embeddings response:", jsonResponse.data[0].embedding);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const embeddings = jsonResponse.data.map((object) => {
    return object.embedding;
  });
  return embeddings;
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
