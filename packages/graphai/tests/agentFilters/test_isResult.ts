import { GraphAI } from "@/index";
import { AgentFilterFunction } from "@/type";

import * as agents from "~/test_agents";
import { graphDataLatestVersion } from "~/common";

import test from "node:test";
import assert from "node:assert";

const simpleAgentFilter1: AgentFilterFunction = async (context, next) => {
  context.filterParams["isResult"] = !!context.debugInfo.isResult;
  return next(context);
};

test("test agent filter", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          filter: [],
          filterParams: true,
        },
        isResult: true,
      },
      bypassAgent: {
        agent: "bypassAgent",
        params: { namedKey: "text" },
        inputs: { text: [":echo"] },
      },
    },
  };
  const agentFilters = [
    {
      name: "simpleAgentFilter1",
      agent: simpleAgentFilter1,
    },
  ];

  const graph = new GraphAI({ ...graph_data }, { ...agents }, { agentFilters });
  const result = await graph.run();
  assert.deepStrictEqual(result, { echo: { isResult: true } });
});

test("test agent filter", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          filter: [],
          filterParams: true,
        },
      },
      bypassAgent: {
        agent: "bypassAgent",
        params: { namedKey: "text" },
        inputs: { text: [":echo"] },
        isResult: true,
      },
    },
  };
  const agentFilters = [
    {
      name: "simpleAgentFilter1",
      agent: simpleAgentFilter1,
    },
  ];

  const graph = new GraphAI({ ...graph_data }, { ...agents }, { agentFilters });
  const result = await graph.run();
  assert.deepStrictEqual(result, { bypassAgent: [{ isResult: false }] });
});
