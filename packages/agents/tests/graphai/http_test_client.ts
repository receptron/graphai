import { AgentFunction, agentInfoWrapper } from "graphai";

import { graphDataTestRunner } from "@receptron/test_utils";

import test from "node:test";
import assert from "node:assert";

const httpClientAgent: AgentFunction<Record<string, string>> = async (context) => {
  const { params } = context;
  // console.log("executing", nodeId, params, inputs);

  const response = await fetch(params.url);
  const result = await response.json();

  // console.log("completing", nodeId, result);
  return result;
};

const graph_data = {
  version: 0.5,
  nodes: {
    node1: {
      params: {
        url: "http://127.0.0.1:8080/llm.json",
      },
      agent: "httpClientAgent",
    },
    node2: {
      params: {
        url: "http://127.0.0.1:8080/llm2.json",
      },
      inputs: { text: ":node1" },
      agent: "httpClientAgent",
    },
  },
};

test("test http client", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, { httpClientAgent: agentInfoWrapper(httpClientAgent) });
  assert.deepStrictEqual(result, {
    node1: { result: true, messages: ["hello"] },
    node2: { result: true, messages: ["hello2"] },
  });
});
