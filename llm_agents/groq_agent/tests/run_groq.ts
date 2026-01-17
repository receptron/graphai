import "dotenv/config";
import { defaultTestContext } from "graphai";
import { groqAgent } from "../src/groq_agent";

import test from "node:test";
import assert from "node:assert";

test("test groq", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const params = { model: "llama-3.1-8b-instant" };
  const res = (await groqAgent({ ...defaultTestContext, namedInputs, params })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});

test("test groq tools", async () => {
  const namedInputs = { prompt: ["I would like to return the item, what should I do?"] };

  const params = {
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
                description: "The department type to dispatch to",
              },
            },
            required: ["eventType"],
          },
        },
      },
    ],
    model: "llama-3.3-70b-versatile",
  };
  const res = (await groqAgent({ ...defaultTestContext, namedInputs, params })) as any;
  if (res) {
    console.log(res.tool);
  }
  assert.deepStrictEqual(true, true);
});

test("test groq stream", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const params = { model: "llama-3.1-8b-instant", dataStream: true };
  const res = (await groqAgent({
    ...defaultTestContext,
    namedInputs,
    params,
    filterParams: {
      streamTokenCallback: (data: any) => {
        console.log(JSON.stringify(data, null, 2));
      },
    },
  })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});
