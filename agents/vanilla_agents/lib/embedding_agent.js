"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEmbeddingsAgent = void 0;
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
const stringEmbeddingsAgent = async ({ params, namedInputs, config, }) => {
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
    const jsonResponse = await response.json();
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
exports.stringEmbeddingsAgent = stringEmbeddingsAgent;
const stringEmbeddingsAgentInfo = {
    name: "stringEmbeddingsAgent",
    agent: exports.stringEmbeddingsAgent,
    mock: exports.stringEmbeddingsAgent,
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
exports.default = stringEmbeddingsAgentInfo;
