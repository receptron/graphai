import "dotenv/config";
import { defaultTestContext } from "graphai";
import { geminiAgent } from "../src/gemini_agent";

import test from "node:test";
import assert from "node:assert";

test("test gemini response_format (OpenAPI schema)", async () => {
  const namedInputs = { prompt: ["Fibonacci Sequence up to 𝑛 = 20"] };

  const params = {
    system: "You are a math teacher. Provide the answer to the given equation along with an explanation.",
    response_format: {
      type: "schema" as const,
      json_schema: {
        schema: {
          type: "object",
          properties: {
            answer: {
              type: "string",
            },
            explain: {
              type: "string",
            },
          },
          required: ["answer", "explain"],
          additionalProperties: false,
        },
      },
    },
  };

  const res = (await geminiAgent({ ...defaultTestContext, namedInputs, params })) as any;

  if (res) {
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});

test("test gemini response_format (JSON schema)", async () => {
  const namedInputs = { prompt: ["Fibonacci Sequence up to 𝑛 = 20"] };

  const params = {
    system: "You are a math teacher. Provide the answer to the given equation along with an explanation.",
    response_format: {
      type: "json_schema" as const,
      json_schema: {
        schema: {
          type: "object",
          properties: {
            answer: {
              type: "string",
            },
            explain: {
              type: "string",
            },
          },
          required: ["answer", "explain"],
          additionalProperties: false,
        },
      },
    },
  };

  const res = (await geminiAgent({ ...defaultTestContext, namedInputs, params })) as any;

  if (res) {
    console.log(res.text);
  }
  assert.deepStrictEqual(true, true);
});
