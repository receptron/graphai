import "dotenv/config";
import { defaultTestContext } from "graphai";
import { geminiAgent } from "../src/gemini_agent";
import { SchemaType } from "@google/generative-ai";

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
  }
  assert.deepStrictEqual(true, true);
});

test("test gemini stream", async () => {
  const namedInputs = { prompt: ["tell me world history"] };
  const params = { stream: true };
  const res = (await geminiAgent({
    ...defaultTestContext,
    namedInputs,
    params,
    filterParams: {
      streamTokenCallback: (token: string) => {
        console.log(token);
      },
    },
  })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});

test("test gemini response_format", async () => {
  const schema = {
    description: "List of recipes",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        recipeName: {
          type: SchemaType.STRING,
          description: "Name of the recipe",
          nullable: false,
        },
      },
      required: ["recipeName"],
    },
  };
  const namedInputs = { prompt: ["List a few popular cookie recipes."] };
  const params = { response_format: schema };
  const res = (await geminiAgent({
    ...defaultTestContext,
    namedInputs,
    params,
  })) as any;

  console.log(res);
  if (res) {
    console.log(res.choices[0].message["content"]);
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});
