import "dotenv/config";
import { defaultTestContext } from "graphai";
import { openAIAgent } from "../src/openai_agent";

import test from "node:test";
import assert from "node:assert";

const baseURL = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

if (!baseURL || !apiKey) {
  console.error("AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY are required");
  process.exit(1);
}

test("test azure openai", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const config = { baseURL, apiKey, apiVersion };
  const res = (await openAIAgent({ ...defaultTestContext, namedInputs, config })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});

test("test azure openai with model", async () => {
  const namedInputs = { prompt: ["hello, what is the capital of Japan?"] };
  const config = { baseURL, apiKey, apiVersion, model: "gpt-4o" };
  const res = (await openAIAgent({ ...defaultTestContext, namedInputs, config })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});

test("test azure openai stream", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const config = { baseURL, apiKey, apiVersion, stream: true };
  const res = (await openAIAgent({
    ...defaultTestContext,
    namedInputs,
    config,
    filterParams: {
      streamTokenCallback: (token: string) => {
        process.stdout.write(token);
      },
    },
  })) as any;

  console.log("\n--- Final result ---");
  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});
