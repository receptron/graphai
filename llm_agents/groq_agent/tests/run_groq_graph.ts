import "dotenv/config";
import * as agent from "@/index";

import { graphDataTestRunner } from "@receptron/test_utils";

import { graphDataGroqMath } from "./graphData";

import test from "node:test";

test("test groq graph", async () => {
  const result = (await graphDataTestRunner(__dirname, __filename, graphDataGroqMath, agent)) as any;

  console.log(result.llm.choices[0].message["content"]);
});
