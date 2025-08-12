import "dotenv/config";
import { defaultTestContext } from "graphai";
import { openAIAgent } from "../src/openai_agent";

import test from "node:test";
import assert from "node:assert";

test("test openai tools", async () => {
  const namedInputs = { prompt: ["let me know Japanese Eras"] };

  const params = {
    system: "Return Japanese historical eras with their start and end years.",
    dataStream: true,
    tool_choice: "auto" as const,
    tools: [
      {
        type: "function" as const,
        function: {
          name: "getJapaneseEras",
          description: "Return an array of Japanese eras with start year, end year, and era name.",
          parameters: {
            type: "object",
            properties: {
              eras: {
                type: "array",
                description: "List of Japanese eras with start and end years",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Era name (e.g., Heian, Taisho)" },
                    startYear: { type: "integer", description: "Start year in AD" },
                    endYear: { type: "integer", description: "End year in AD" },
                  },
                  required: ["name", "startYear", "endYear"],
                },
              },
            },
            required: ["eras"],
          },
        },
      },
    ],
  };

  const res = (await openAIAgent({
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
    console.log(res.tool);
  }
  assert.deepStrictEqual(true, true);
});
