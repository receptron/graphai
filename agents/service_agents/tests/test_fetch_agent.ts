import { graphDataTestRunner } from "@receptron/test_utils";
import { fetchAgent } from "@/index";
import { propertyFilterAgent, copyAgent } from "@graphai/vanilla";

import test from "node:test";
import assert from "node:assert";

const graph_data_fetch = {
  version: 0.5,
  nodes: {
    url: {
      value: "https://www.google.com/search?q=hello",
    },
    fetch: {
      agent: "fetchAgent",
      params: {
        type: "text",
      },
      inputs: { url: ":url" },
    },
    success: {
      agent: "copyAgent",
      isResult: true,
      unless: ":fetch.onError",
      inputs: [true],
    },
    error: {
      agent: "copyAgent",
      isResult: true,
      if: ":fetch.onError",
      inputs: [":fetch.onError"],
    },
  },
};

test("test fetch", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graph_data_fetch, { fetchAgent, copyAgent }, () => {}, false);
  assert.deepStrictEqual(result, { success: true });
});

const graph_data_post = {
  version: 0.5,
  nodes: {
    url: {
      value: "https://www.google.com/search?q=hello",
    },
    fetch: {
      agent: "fetchAgent",
      params: {
        type: "text",
      },
      inputs: { url: ":url", body: "Posting data" },
    },
    success: {
      agent: "copyAgent",
      isResult: true,
      unless: ":fetch.onError",
      inputs: [true],
    },
    error: {
      agent: "propertyFilterAgent",
      params: {
        include: ["message", "status"],
      },
      isResult: true,
      if: ":fetch.onError",
      inputs: [":fetch.onError"],
    },
  },
};

test("test fetch post", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graph_data_post, { fetchAgent, copyAgent, propertyFilterAgent }, () => {}, false);
  assert.deepStrictEqual(result, {
    error: {
      message: "HTTP error: 405",
      status: 405,
    },
  });
});
