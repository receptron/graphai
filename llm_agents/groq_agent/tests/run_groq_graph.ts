import "dotenv/config";
import * as agent from "@/index";

import { graphDataTestRunner } from "@receptron/test_utils";

import { graphDataAnthropicMath } from "./graphData";

import test from "node:test";

test("test anthropic graph", async () => {
  const result = (await graphDataTestRunner(__dirname, __filename, graphDataAnthropicMath, agent)) as any;

  console.log(result.llm.choices[0].message["content"]);
});
