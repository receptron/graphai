import { GraphAI, GraphData, ConfigDataDictionary, DefaultConfigData } from "graphai";
import geminiAgentInfo from "../src/gemini_agent";

import test from "node:test";
import assert from "node:assert";

const stubFetch = (requested: string[]) => {
  globalThis.fetch = (async (url: string) => {
    const matched = String(url).match(/\/models\/([^:]+):/);
    requested.push(matched ? matched[1] : "");
    return new Response(JSON.stringify({ candidates: [{ content: { role: "model", parts: [{ text: "ok" }] }, finishReason: "STOP" }], usageMetadata: {} }), {
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
      dynamicModel: { value: "gemini-2.5-pro" },
      llmCall: { agent: "geminiAgent", isResult: true, ...node },
    },
  };
  await new GraphAI(graphData, { geminiAgent: geminiAgentInfo }, config ? { config } : {}).run();
  return requested[0];
};

test("model from inputs", async () => {
  const model = await runWithNode({ inputs: { prompt: "hi", model: ":dynamicModel" }, params: { apiKey: "dummy", model: "gemini-2.5-flash" } });
  assert.strictEqual(model, "gemini-2.5-pro");
});

test("model from params overrides config", async () => {
  const model = await runWithNode(
    { inputs: { prompt: "hi" }, params: { model: "gemini-2.5-pro" } },
    { geminiAgent: { apiKey: "dummy", model: "gemini-2.5-flash" } },
  );
  assert.strictEqual(model, "gemini-2.5-pro");
});

test("model from config", async () => {
  const model = await runWithNode({ inputs: { prompt: "hi" }, params: {} }, { geminiAgent: { apiKey: "dummy", model: "gemini-2.5-pro" } });
  assert.strictEqual(model, "gemini-2.5-pro");
});

test("model falls back when unspecified", async () => {
  const model = await runWithNode({ inputs: { prompt: "hi" }, params: { apiKey: "dummy" } });
  assert.strictEqual(model, "gemini-2.5-flash");
});
