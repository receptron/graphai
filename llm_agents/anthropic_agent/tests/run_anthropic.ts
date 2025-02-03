import "dotenv/config";
import { anthropicAgent } from "@/anthropic_agent";
import { defaultTestContext } from "graphai";

import test from "node:test";
import assert from "node:assert";

test("test anthropicAgent", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const res = (await anthropicAgent({ ...defaultTestContext, namedInputs })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});

test("test anthropicAgent stream", async () => {
  const namedInputs = { prompt: ["hello, let me the world history"] };
  const params = { stream: true };
  const opt = {
    ...defaultTestContext,
    namedInputs,
    params,
    filterParams: {
      streamTokenCallback: (token: string) => {
        console.log(token);
      },
    },
  };
  const res = (await anthropicAgent(opt)) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});

test("test anthropicAgent", async () => {
  const namedInputs = {
    prompt: ["hello, let me know the answer 1 + 1"],
    system: ["You are an assembly programmer. Please answer the given calculation using a program for z80."],
  };
  const res = (await anthropicAgent({ ...defaultTestContext, namedInputs })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});

test("test anthropicAgent tools", async () => {
  const tools = [
    {
      type: "function",
      function: {
        name: "setCenter",
        description: "set center location",
        parameters: {
          type: "object",
          properties: {
            lat: {
              type: "number",
              description: "latitude of center",
            },
            lng: {
              type: "number",
              description: "longtitude of center",
            },
          },
          required: ["lat", "lng"],
        },
      },
    },
  ];

  const namedInputs = {
    prompt: ["go to white house"],
    system: ["You are google map operator."],
  };
  const res = (await anthropicAgent({ ...defaultTestContext, namedInputs, params: { tools, stream: true } })) as any;
  if (res) {
    console.log(res);
    console.log(res.choices[0].message["content"]);
    console.log(res.content);
  }
  assert.deepStrictEqual(true, true);
});
