import "dotenv/config";
import { geminiAgent } from "@/gemini_agent";

import test from "node:test";
import assert from "node:assert";

test("test gemini", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const params = {};
  const res = (await geminiAgent({ inputs: [], namedInputs, params, filterParams: {}, debugInfo: { verbose: false, nodeId: "test", retry: 5 } })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});

test("test gemini", async () => {
  const namedInputs = { prompt: ["I would like to return the item, what should I do?"] };

  const params = {
    system: "You are a telephone operator~. Listen well to what the other person is saying and decide which one to connect with.",
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

  const res = (await geminiAgent({ inputs: [], namedInputs, params, filterParams: {}, debugInfo: { verbose: false, nodeId: "test", retry: 5 } })) as any;

  if (res) {
    console.log(res);
  }
  assert.deepStrictEqual(true, true);
});
