import { GraphAI } from "@/graphai";
import { AgentFilterFunction } from "@/type";

import { defaultTestAgents } from "@/utils/test_agents";

import test from "node:test";
import assert from "node:assert";

const httpAgentFilter: AgentFilterFunction = async (context, next) => {
  console.log(context.filterParams);
  return next(context);
};

const callbackDictonary = {};

test("test filterParams on agent filter", async () => {
  const graph_data = {
    version: 0.3,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          filterParams: true,
        },
      },
      bypassAgent: {
        agent: "bypassAgent",
        inputs: [":echo"],
        isResult: true,
      },
    },
  };
  const agentFilters = [
    {
      name: "httpAgentFilter",
      agent: httpAgentFilter,
      filterParams: {
        agentServer: {
          baseUrl: "http://localhost:8085/agents/",
          stream: true,
        },
      },
      agentIds: ["echoAgent"],
    },
  ];

  const graph = new GraphAI({ ...graph_data }, { ...defaultTestAgents, ...callbackDictonary }, { agentFilters });

  const result = await graph.run();
  console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { bypassAgent: [{ agentServer: { baseUrl: "http://localhost:8085/agents/", stream: true } }] });
});

test("test filterParams on agent filter2", async () => {
  const graph_data = {
    version: 0.3,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          filterParams: true,
        },
        filterParams: {
          agentServer: {
            baseUrl: "http://localhost:8081/agents/",
          },
        },
      },
      bypassAgent: {
        agent: "bypassAgent",
        inputs: [":echo"],
        isResult: true,
      },
    },
  };
  const agentFilters = [
    {
      name: "httpAgentFilter",
      agent: httpAgentFilter,
      filterParams: {
        agentServer: {
          baseUrl: "http://localhost:8085/agents/",
          stream: true,
        },
      },
      agentIds: ["echoAgent"],
    },
  ];

  const graph = new GraphAI({ ...graph_data }, { ...defaultTestAgents, ...callbackDictonary }, { agentFilters });

  const result = await graph.run();
  console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { bypassAgent: [{ agentServer: { baseUrl: "http://localhost:8081/agents/", stream: true } }] });
});
