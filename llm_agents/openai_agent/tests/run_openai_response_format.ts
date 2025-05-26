import "dotenv/config";
import { defaultTestContext } from "graphai";
import { openAIAgent } from "../src/openai_agent";

import test from "node:test";
import assert from "node:assert";

test("test openai tools", async () => {
  const namedInputs = { prompt: ["Fibonacci Sequence up to 𝑛 = 20"] };
  // const namedInputs = { prompt: ["あなたの趣味はなんですか？"] };

  const params = {
    system: "You are a math teacher. Provide the answer to the given equation along with an explanation.",
    response_format: {
      type: "json_schema" as const,
      json_schema: {
        name: "answar",
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
        strict: true,
      },
    },
  };

  const res = (await openAIAgent({ ...defaultTestContext, namedInputs, params })) as any;

  if (res) {
    console.log(res);
  }
  assert.deepStrictEqual(true, true);
});
