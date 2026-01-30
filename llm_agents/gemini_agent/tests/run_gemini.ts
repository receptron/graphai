import "dotenv/config";
import { defaultTestContext } from "graphai";
import { geminiAgent } from "../src/gemini_agent";

import test from "node:test";
import assert from "node:assert";

test("test gemini", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const res = (await geminiAgent({ ...defaultTestContext, namedInputs })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});

test("test gemini tools", async () => {
  const namedInputs = { prompt: ["I would like to return the item, what should I do?"] };

  const params = {
    stream: true,
    system: "You are a telephone operator. Listen well to what the other person is saying and decide which one to connect with.",
    tool_choice: "any" as const,
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
          // required: ["eventType"],
        },
      },
    ],
  };

  const res = (await geminiAgent({ ...defaultTestContext, namedInputs, params })) as any;

  if (res) {
    console.log(res);
    console.log(res.tool_calls);
  }
  assert.deepStrictEqual(true, true);
});

test("test gemini multiple tools", async () => {
  const namedInputs = { prompt: ["let me know weather of Tokyo and rate of USDJPY"] };

  const tools = [
    {
      type: "function",
      function: {
        name: "generalToolAgent--get_weather",
        description: "Get current weather for a city.",
        parameters: {
          type: "object",
          properties: {
            city: { type: "string", description: "City name." },
            unit: { type: "string", enum: ["C", "F"], description: "Temperature unit." },
          },
          required: ["city"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "generalToolAgent--get_fx_rate",
        description: "Get spot FX rate for a currency pair like USDJPY.",
        parameters: {
          type: "object",
          properties: {
            pair: { type: "string", pattern: "^[A-Za-z]{6}$", description: "Six-letter pair, e.g., USDJPY." },
          },
          required: ["pair"],
          additionalProperties: false,
        },
      },
    },
  ];
  const params = {
    stream: true,
    tool_choice: "any" as const,
    tools: tools,
  };

  const res = (await geminiAgent({ ...defaultTestContext, namedInputs, params })) as any;

  if (res) {
    console.log(res);
    console.log(res.tool_calls);
    console.log(`tool_calls.length: ${res.tool_calls.length} (expected: 2, may vary)`);
  }
  assert.deepStrictEqual(true, true);
});

test("test gemini tools not called", async () => {
  const namedInputs = { prompt: ["I would like to return the item, what should I do?"] };

  const params = {
    stream: true,
    system: "You are a telephone operator. Listen well to what the other person is saying and decide which one to connect with.",
    tool_choice: "none" as const,
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
        },
      },
    ],
  };

  const res = (await geminiAgent({ ...defaultTestContext, namedInputs, params })) as any;

  if (res) {
    console.log(res);
    console.log(res.tool_calls);
  }
  assert.deepStrictEqual(true, true);
});

test("test gemini stream", async () => {
  const namedInputs = { prompt: ["tell me world history"] };
  const params = { dataStream: true };
  const res = (await geminiAgent({
    ...defaultTestContext,
    namedInputs,
    params,
    filterParams: {
      streamTokenCallback: (data: any) => {
        console.log(data?.response?.output?.[0].text);
      },
    },
  })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});

// Verify that streamed chunks are correctly concatenated
test("test gemini stream concatenation", async () => {
  const collectedChunks: string[] = [];
  const namedInputs = { prompt: ["Explain the Fibonacci sequence in 3 sentences."] };
  const params = { dataStream: true };

  const res = (await geminiAgent({
    ...defaultTestContext,
    namedInputs,
    params,
    filterParams: {
      streamTokenCallback: (data: any) => {
        const text = data?.response?.output?.[0]?.text;
        if (text) {
          collectedChunks.push(text);
        }
      },
    },
  })) as any;

  const concatenatedFromChunks = collectedChunks.join("");

  console.log("Collected chunks:", collectedChunks);
  console.log("Concatenated from chunks:", concatenatedFromChunks);
  console.log("Result text:", res.text);

  // Verify that the final result contains the concatenated stream content
  assert.ok(res.text, "Result text should not be empty");
  assert.ok(collectedChunks.length > 0, "Should have collected at least one chunk");
  assert.strictEqual(res.text, concatenatedFromChunks, "Result text should match concatenated chunks");
});
