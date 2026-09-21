import { GraphAI, GraphData, ConfigDataDictionary, DefaultConfigData } from "graphai";
import anthropicAgentInfo from "../src/anthropic_agent";

import test from "node:test";
import assert from "node:assert";

const stubFetch = (requested: string[]) => {
  globalThis.fetch = (async (__url: string, init: { body: string }) => {
    requested.push(JSON.parse(init.body).model);
    return new Response(
      JSON.stringify({
        id: "id",
        type: "message",
        role: "assistant",
        model: "stub",
        content: [{ type: "text", text: "ok" }],
        stop_reason: "end_turn",
        usage: { input_tokens: 1, output_tokens: 1 },
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
      dynamicModel: { value: "claude-haiku-4-5" },
      llmCall: { agent: "anthropicAgent", isResult: true, ...node },
    },
  };
  await new GraphAI(graphData, { anthropicAgent: anthropicAgentInfo }, config ? { config } : {}).run();
  return requested[0];
};

test("model from inputs", async () => {
  const model = await runWithNode({ inputs: { prompt: "hi", model: ":dynamicModel" }, params: { apiKey: "dummy", model: "claude-sonnet-4-5" } });
  assert.strictEqual(model, "claude-haiku-4-5");
});

test("model from params overrides config", async () => {
  const model = await runWithNode(
    { inputs: { prompt: "hi" }, params: { model: "claude-haiku-4-5" } },
    { anthropicAgent: { apiKey: "dummy", model: "claude-sonnet-4-5" } },
  );
  assert.strictEqual(model, "claude-haiku-4-5");
});

test("model from config", async () => {
  const model = await runWithNode({ inputs: { prompt: "hi" }, params: {} }, { anthropicAgent: { apiKey: "dummy", model: "claude-haiku-4-5" } });
  assert.strictEqual(model, "claude-haiku-4-5");
});

test("apiKey is not read from inputs", async () => {
  await assert.rejects(() => runWithNode({ inputs: { prompt: "hi", apiKey: "dummy", model: "claude-haiku-4-5" }, params: {} }));
});
