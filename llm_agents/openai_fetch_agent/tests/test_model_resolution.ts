import { GraphAI, GraphData, ConfigDataDictionary, DefaultConfigData } from "graphai";
import openAIFetchAgentInfo from "../src/openai_fetch_agent";

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
      dynamicModel: { value: "gpt-4o-mini" },
      llmCall: { agent: "openAIFetchAgent", isResult: true, ...node },
    },
  };
  await new GraphAI(graphData, { openAIFetchAgent: openAIFetchAgentInfo }, config ? { config } : {}).run();
  return requested[0];
};

test("model from inputs", async () => {
  const model = await runWithNode({ inputs: { prompt: "hi", model: ":dynamicModel" }, params: { apiKey: "dummy", model: "gpt-4o" } });
  assert.strictEqual(model, "gpt-4o-mini");
});

test("model from params overrides config", async () => {
  const model = await runWithNode({ inputs: { prompt: "hi" }, params: { model: "gpt-4o-mini" } }, { openAIFetchAgent: { apiKey: "dummy", model: "gpt-4o" } });
  assert.strictEqual(model, "gpt-4o-mini");
});

test("model from config", async () => {
  const model = await runWithNode({ inputs: { prompt: "hi" }, params: {} }, { openAIFetchAgent: { apiKey: "dummy", model: "gpt-4o-mini" } });
  assert.strictEqual(model, "gpt-4o-mini");
});

test("apiKey is not read from inputs", async () => {
  await assert.rejects(() => runWithNode({ inputs: { prompt: "hi", apiKey: "dummy", model: "gpt-4o-mini" }, params: {} }));
});
