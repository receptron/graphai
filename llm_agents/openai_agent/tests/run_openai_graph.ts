import "dotenv/config";
import * as agent from "@/index";

import { graphDataTestRunner } from "@receptron/test_utils";

import { graphDataOpenAIMath, graphDataOpenAIPaint, graphDataOpenAIImageDescription } from "./graphData";

import test from "node:test";

test("test openai graph", async () => {
  const result = (await graphDataTestRunner(__dirname, __filename, graphDataOpenAIMath, agent)) as any;

  console.log(result.llm.choices[0].message["content"]);
});

test("test openai graph generate image", async () => {
  const result = (await graphDataTestRunner(__dirname, __filename, graphDataOpenAIPaint, agent)) as any;

  console.log(result.llm.data[0]);
});
test("test openai graph image description", async () => {
  const result = (await graphDataTestRunner(__dirname, __filename, graphDataOpenAIImageDescription, agent)) as any;

  console.log(result.llm.choices[0].message["content"]);
});
