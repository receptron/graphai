import { GraphAI, AgentFunction, agentInfoWrapper } from "@/index";
import { graphDataLatestVersion } from "~/common";

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    result: {
      agent: "testAgent",
      inputs: [":message"],
      isResult: true,
    },
  },
};

import test from "node:test";
import assert from "node:assert";

test("test named inputs", async () => {
  const testAgent: AgentFunction = async ({ config }) => {
    return config;
  };
  const config = { message: "hello" };
  const graph = new GraphAI(graph_data, { testAgent: agentInfoWrapper(testAgent) }, { config });
  const result = await graph.run();
  assert.deepStrictEqual(result, { result: { message: "hello" } });
});
