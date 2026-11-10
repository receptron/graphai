import { isObject } from "graphai";

type EmbeddingEntry = {
  embedding: number[];
};

type OpenAIEmbeddingResponse = {
  data: EmbeddingEntry[];
};

type OllamaEmbeddingResponse = {
  embeddings: number[][];
};

const isVector = (value: unknown): value is number[] => Array.isArray(value) && value.every((element) => typeof element === "number");

const isVectors = (value: unknown): value is number[][] => Array.isArray(value) && value.every(isVector);

const isEmbeddingEntry = (value: unknown): value is EmbeddingEntry => isObject(value) && isVector(value.embedding);

const isEmbeddingEntries = (value: unknown): value is EmbeddingEntry[] => Array.isArray(value) && value.every(isEmbeddingEntry);

const isOpenAIEmbeddingResponse = (body: unknown): body is OpenAIEmbeddingResponse => isObject(body) && isEmbeddingEntries(body.data);

const isOllamaEmbeddingResponse = (body: unknown): body is OllamaEmbeddingResponse => isObject(body) && isVectors(body.embeddings);

const shapeOf = (body: unknown): string => {
  if (body === null) return "null";
  if (!isObject(body)) return typeof body;
  if (Array.isArray(body)) return `an array of length ${body.length}`;
  const keys = Object.keys(body);
  if (keys.length > 0) return `keys ${keys.join(", ")}`;
  const tag = Object.prototype.toString.call(body);
  return tag === "[object Object]" ? "an object with no keys" : tag;
};

export const embeddingsOf = (body: unknown): number[][] => {
  if (isOpenAIEmbeddingResponse(body)) {
    return body.data.map((entry) => entry.embedding);
  }
  if (isOllamaEmbeddingResponse(body)) {
    return body.embeddings;
  }
  throw new Error(`stringEmbeddingsAgent: unexpected embeddings response: ${shapeOf(body)}`);
};
