import { stringEmbeddingsAgent } from "../../src/index";
import { embeddingsOf } from "../../src/embedding_response";
import { defaultTestContext } from "graphai";

import test from "node:test";
import assert from "node:assert";

const vectors = [
  [0.1, 0.2],
  [0.3, 0.4],
];

const openAIBody = {
  object: "list",
  model: "text-embedding-3-small",
  usage: { prompt_tokens: 2, total_tokens: 2 },
  data: vectors.map((embedding, index) => ({ object: "embedding", index, embedding })),
};

const ollamaBody = {
  model: "mxbai-embed-large",
  embeddings: vectors,
  total_duration: 1,
};

const runAgent = async (body: string, status: number = 200) => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response(body, { status });
  try {
    return await stringEmbeddingsAgent.agent({
      ...defaultTestContext,
      params: {},
      namedInputs: { item: "hello" },
    });
  } finally {
    globalThis.fetch = original;
  }
};

test("test embeddingsOf reads both provider shapes", () => {
  assert.deepStrictEqual(embeddingsOf(openAIBody), vectors);
  assert.deepStrictEqual(embeddingsOf(ollamaBody), vectors);
});

test("test embeddingsOf accepts a provider that returned no vectors", () => {
  assert.deepStrictEqual(embeddingsOf({ data: [] }), []);
  assert.deepStrictEqual(embeddingsOf({ embeddings: [] }), []);
});

test("test embeddingsOf rejects a shape it cannot read", () => {
  const unreadable: unknown[] = [
    { object: "list", usage: { prompt_tokens: 2 } },
    {},
    null,
    undefined,
    "<html></html>",
    42,
    [],
    { data: {} },
    { data: [{}] },
    { data: [{ embedding: ["0.1"] }] },
    { embeddings: [0.1, 0.2] },
    { embeddings: [[null]] },
  ];
  unreadable.forEach((body) => {
    assert.throws(() => embeddingsOf(body), /unexpected embeddings response/);
  });
});

test("test embeddingsOf names what it received", () => {
  assert.throws(() => embeddingsOf({ object: "list", usage: {} }), /keys object, usage/);
  assert.throws(() => embeddingsOf(null), /response: null/);
  assert.throws(() => embeddingsOf("<html></html>"), /response: string/);
});

test("test stringEmbeddingsAgent returns the vectors", async () => {
  assert.deepStrictEqual(await runAgent(JSON.stringify(openAIBody)), vectors);
  assert.deepStrictEqual(await runAgent(JSON.stringify(ollamaBody)), vectors);
});

test("test stringEmbeddingsAgent reports the status of a failure that is not JSON", async () => {
  await assert.rejects(async () => await runAgent("<html><body>Bad Gateway</body></html>", 502), {
    message: "HTTP error! status: 502",
    name: "Error",
  });
});

test("test stringEmbeddingsAgent fails on a success it cannot read", async () => {
  await assert.rejects(async () => await runAgent(JSON.stringify({ object: "list", usage: {} })), /unexpected embeddings response/);
});
