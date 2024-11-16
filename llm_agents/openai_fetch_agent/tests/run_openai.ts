import "dotenv/config";
import { openAIFetchAgent } from "@/openai_fetch_agent";

import test from "node:test";
import assert from "node:assert";

test("test openai", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };

  const params = {
    apiKey: process.env["OPENAI_API_KEY"],
  };
  const res = (await openAIFetchAgent({ inputs: [], namedInputs, params, filterParams: {}, debugInfo: { verbose: false, nodeId: "test", retry: 5 } })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});

test("test openai streaming", async () => {
  const namedInputs = { prompt: ["let me know world history"] };

  const params = {
    apiKey: process.env["OPENAI_API_KEY"],
    stream: true,
  };
  const streamTokenCallback = (token: string) => {
    console.log(token);
  };
  const res = (await openAIFetchAgent({
    inputs: [],
    namedInputs,
    params,
    filterParams: { streamTokenCallback },
    debugInfo: { verbose: false, nodeId: "test", retry: 5 },
  })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});

test("test openai tools", async () => {
  const namedInputs = { prompt: ["I would like to return the item, what should I do?"] };

  const params = {
    apiKey: process.env["OPENAI_API_KEY"],
    system: "You are a telephone operator~. Listen well to what the other person is saying and decide which one to connect with.",
    tool_choice: "auto" as const,
    tools: [
      {
        type: "function" as const,
        function: {
          name: "dispatchNextEvent",
          description: "Determine which department to respond to next",
          parameters: {
            type: "object",
            properties: {
              eventType: {
                type: "string",
                enum: ["Returns", "Payment", "How to order", "Others", "Defective products"],
                description: "The user name",
              },
            },
          },
          required: ["eventType"],
        },
      },
    ],
  };

  const res = (await openAIFetchAgent({ inputs: [], namedInputs, params, filterParams: {}, debugInfo: { verbose: false, nodeId: "test", retry: 5 } })) as any;

  if (res) {
    console.log(res.tool);
  }
  assert.deepStrictEqual(true, true);
});
