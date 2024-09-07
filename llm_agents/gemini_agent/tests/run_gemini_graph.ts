import "dotenv/config";
import * as agent from "@/index";

import { graphDataTestRunner } from "@receptron/test_utils";

import { graphDataGeminiMath } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test openai graph", async () => {
  const result = (await graphDataTestRunner(__dirname, __filename, graphDataGeminiMath, agent)) as any;

  console.log(result.llm.choices[0].message["content"]);
});
