import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "@/utils/test_agents";
import { fetchAgent, propertyFilterAgent, groqAgent, stringTemplateAgent, copyAgent } from "@/experimental_agents";

import test from "node:test";
import assert from "node:assert";

const graph_data_fetch = {
  version: 0.3,
  nodes: {
    url: {
      value: "https://www.google.com/search?q=hello",
    },
    fetch: {
      agent: "fetchAgent",
      params: {
        type: "text",
      },
      inputs: [":url"]
    },
    success: {
      agent: "copyAgent",
      isResult: true,
      unless: ":fetch.onError",
      inputs: [true],
    },
    failed: {
      agent: "copyAgent",
      isResult: true,
      unless: ":fetch.onError",
      inputs: [":fetch.onError"],
    },
  },
};

test("test fetch", async () => {
  const result = await graphDataTestRunner(__filename, graph_data_fetch, { fetchAgent, copyAgent, ...defaultTestAgents }, () => {}, false);
  console.log(result);
  assert.deepStrictEqual(result, {success:true});
});