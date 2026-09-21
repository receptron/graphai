import { GraphAI, GraphData, ConfigDataDictionary, DefaultConfigData } from "graphai";
import groqAgentInfo from "../src/groq_agent";

import test from "node:test";
import assert from "node:assert";

const stubFetch = (requested: string[]) => {
  globalThis.fetch = (async (__url: string, init: { body: string }) => {
    requested.push(JSON.parse(init.body).model);
    return new Response(
      JSON.stringify({
        id: "id",
        object: "chat.completion",
        created: 0,
        model: "stub",
        choices: [{ index: 0, message: { role: "assistant", content: "ok" }, finish_reason: "stop" }],
        usage: {},
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  }) as unknown as typeof globalThis.fetch;
};

const runWithNode = async (node: Record<string, unknown>, config?: ConfigDataDictionary<DefaultConfigData>) => {
  const requested: string[] = [];
  stubFetch(requested);
  const graphData: GraphData = {
    version: 0.5,
    nodes: {
      dynamicModel: { value: "llama-3.1-8b-instant" },
      llmCall: { agent: "groqAgent", isResult: true, ...node },
    },
  };
  await new GraphAI(graphData, { groqAgent: groqAgentInfo }, config ? { config } : {}).run();
  return requested[0];
};

test("model from inputs", async () => {
  const model = await runWithNode({ inputs: { prompt: "hi", model: ":dynamicModel" }, params: { apiKey: "dummy", model: "llama-3.3-70b-versatile" } });
  assert.strictEqual(model, "llama-3.1-8b-instant");
});

test("model from params overrides config", async () => {
  const model = await runWithNode(
    { inputs: { prompt: "hi" }, params: { model: "llama-3.1-8b-instant" } },
    { groqAgent: { apiKey: "dummy", model: "llama-3.3-70b-versatile" } },
  );
  assert.strictEqual(model, "llama-3.1-8b-instant");
});

test("model from config", async () => {
  const model = await runWithNode({ inputs: { prompt: "hi" }, params: {} }, { groqAgent: { apiKey: "dummy", model: "llama-3.1-8b-instant" } });
  assert.strictEqual(model, "llama-3.1-8b-instant");
});

test("apiKey is not read from inputs", async () => {
  await assert.rejects(() => runWithNode({ inputs: { prompt: "hi", apiKey: "dummy", model: "llama-3.1-8b-instant" }, params: {} }));
});
