import { AgentFunction, AgentFunctionInfo } from "graphai";
import { embeddingsOf } from "./embedding_response";

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

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return embeddingsOf(await response.json());
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
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/embedding_agent.ts",
  package: "@graphai/vanilla",
  cacheType: "pureAgent",
  license: "MIT",
};
export default stringEmbeddingsAgentInfo;
