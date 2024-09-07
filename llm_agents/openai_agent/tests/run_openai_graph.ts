import "dotenv/config";
import openAIAgent from "@/openai_agent";

import { graphDataTestRunner } from "@receptron/test_utils";

import { graphDataOpenAIMath } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test openai graph", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataOpenAIMath, { openAIAgent }) as any;

  console.log(result.llm.choices[0].message["content"]);

});
