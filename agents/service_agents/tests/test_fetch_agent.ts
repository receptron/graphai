import { graphDataTestRunner } from "@receptron/test_utils";
import { fetchAgent } from "@/index";
import { propertyFilterAgent, copyAgent } from "@graphai/vanilla";

import { graphDataFetch, graphDataPost } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test fetch", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataFetch, { fetchAgent, copyAgent }, () => {}, false);
  assert.deepStrictEqual(result, { success: true });
});

test("test fetch post", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphDataPost, { fetchAgent, copyAgent, propertyFilterAgent }, () => {}, false);
  assert.deepStrictEqual(result, {
    error: {
      message: "HTTP error: 405",
      status: 405,
    },
  });
});
