import { GraphAI, AgentFunction, agentInfoWrapper } from "@/index";
import { graphDataLatestVersion } from "~/common";
import * as testAgents from "../test_agents";

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    result: {
      agent: "testAgent",
      inputs: { text: ":message" },
      isResult: true,
    },
  },
};

import test from "node:test";
import assert from "node:assert";

test("test graphai config option", async () => {
  const testAgent: AgentFunction = async ({ config }) => {
    return config;
  };
  const config = { testAgent: { message: "hello" }, global: { userId: "test" } };
  const graph = new GraphAI(graph_data, { testAgent: agentInfoWrapper(testAgent) }, { config });
  const result = await graph.run();
  assert.deepStrictEqual(result, { result: { message: "hello", userId: "test" } });
});

const nested_graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    nested: {
      agent: "nestedAgent",
      inputs: { message: ":message" },
      isResult: true,
      graph: {
        version: 0.5,
        nodes: {
          copy: {
            agent: "copyAgent",
            params: { namedKey: "text" },
            inputs: { text: [":message"] },
            isResult: true,
          },
          test: {
            agent: "testAgent",
            isResult: true,
          },
        },
      },
    },
    result: {
      agent: "echoAgent",
      inputs: { nested: ":nested" },
      isResult: true,
    },
  },
};

test("test graphai nested config option", async () => {
  const testAgent: AgentFunction = async ({ config }) => {
    return config;
  };
  const config = { testAgent: { message: "hello config" } };
  const graph = new GraphAI(nested_graph_data, { testAgent: agentInfoWrapper(testAgent), ...testAgents }, { config });

  const result = await graph.run();
  assert.deepStrictEqual(result, {
    nested: {
      copy: ["Hello World"],
      test: { message: "hello config" },
    },
    result: {},
  });
});
