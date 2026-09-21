import { GraphAI, GraphData, ConfigDataDictionary, DefaultConfigData } from "graphai";
import openAIImageAgentInfo from "../src/openai_image_agent";

import test from "node:test";
import assert from "node:assert";

const stubFetch = (requested: string[]) => {
  globalThis.fetch = (async (__url: string, init: { body: string }) => {
    requested.push(JSON.parse(init.body).model);
    return new Response(JSON.stringify({ created: 0, data: [{ url: "https://example.com/image.png" }] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as unknown as typeof globalThis.fetch;
};

const runWithNode = async (node: Record<string, unknown>, config?: ConfigDataDictionary<DefaultConfigData>) => {
  const requested: string[] = [];
  stubFetch(requested);
  const graphData: GraphData = {
    version: 0.5,
    nodes: {
      dynamicModel: { value: "gpt-image-1" },
      imageCall: { agent: "openAIImageAgent", isResult: true, ...node },
    },
  };
  await new GraphAI(graphData, { openAIImageAgent: openAIImageAgentInfo }, config ? { config } : {}).run();
  return requested[0];
};

test("model from inputs", async () => {
  const model = await runWithNode({ inputs: { prompt: "a cat", model: ":dynamicModel" }, params: { apiKey: "dummy", model: "dall-e-3" } });
  assert.strictEqual(model, "gpt-image-1");
});

test("model from params overrides config", async () => {
  const model = await runWithNode(
    { inputs: { prompt: "a cat" }, params: { model: "gpt-image-1" } },
    { openAIImageAgent: { apiKey: "dummy", model: "dall-e-3" } },
  );
  assert.strictEqual(model, "gpt-image-1");
});

test("model from config", async () => {
  const model = await runWithNode({ inputs: { prompt: "a cat" }, params: {} }, { openAIImageAgent: { apiKey: "dummy", model: "gpt-image-1" } });
  assert.strictEqual(model, "gpt-image-1");
});

test("model falls back when unspecified", async () => {
  const model = await runWithNode({ inputs: { prompt: "a cat" }, params: { apiKey: "dummy" } });
  assert.strictEqual(model, "dall-e-3");
});
