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
const stringEmbeddingsAgent = async ({ params, namedInputs }) => {
    const { array, item } = namedInputs;
    const sources = array ?? [item];
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
    const jsonResponse = await response.json();
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const embeddings = jsonResponse.data.map((object) => {
        return object.embedding;
    });
    return embeddings;
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
    license: "MIT",
};
exports.default = stringEmbeddingsAgentInfo;
