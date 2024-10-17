import { GraphAI } from "@/index";
import { AgentFilterFunction } from "@/type";

import * as agents from "~/test_agents";
import { graphDataLatestVersion } from "~/common";

import test from "node:test";
import assert from "node:assert";

const simpleAgentFilter1: AgentFilterFunction = async (context, next) => {
  if (!context.filterParams["simple"]) {
    context.filterParams["simple"] = [];
  }
  if (context.filterParams) {
    context.filterParams["simple"].push("1");
  }
  return next(context);
};
const simpleAgentFilter2: AgentFilterFunction = async (context, next) => {
  if (!context.filterParams["simple"]) {
    context.filterParams["simple"] = [];
  }
  if (context.filterParams) {
    context.filterParams["simple"].push("2");
  }
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
    {
      name: "simpleAgentFilter2",
      agent: simpleAgentFilter2,
    },
  ];

  const graph = new GraphAI({ ...graph_data }, { ...agents }, { agentFilters });
  const result = await graph.run();
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { bypassAgent: [{ simple: ["1", "2"] }] });
});

test("test agent filter with agent condition", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
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
      agentIds: ["echoAgent"],
    },
    {
      name: "simpleAgentFilter2",
      agent: simpleAgentFilter2,
      agentIds: ["dummy"],
    },
  ];
  // console.log(JSON.stringify(graph_data, null, 2));
  const graph = new GraphAI(graph_data, { ...agents }, { agentFilters });
  const result = await graph.run();
  assert.deepStrictEqual(result, { bypassAgent: [{ simple: ["1"] }] });
});

test("test agent filter with agent condition", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
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
      nodeIds: ["dummy"],
    },
    {
      name: "simpleAgentFilter2",
      agent: simpleAgentFilter2,
      nodeIds: ["echo"],
    },
  ];
  // console.log(JSON.stringify(graph_data, null, 2));
  const graph = new GraphAI(graph_data, { ...agents }, { agentFilters });
  const result = await graph.run();
  assert.deepStrictEqual(result, { bypassAgent: [{ simple: ["2"] }] });
});
