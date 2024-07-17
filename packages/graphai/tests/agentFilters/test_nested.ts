import { GraphAI, AgentFilterFunction } from "@/index";

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

test("test nested agent filter", async () => {
  const graph_data = {
    version: graphDataLatestVersion,

    nodes: {
      nested1: {
        agent: "nestedAgent",
        graph: {
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
              inputs: [":echo"],
              isResult: true,
            },
          },
        },
        isResult: true,
      },
    },
  };

  const graph = new GraphAI({ ...graph_data }, { ...agents }, { agentFilters });
  const result = await graph.run();
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { nested1: { bypassAgent: [{ simple: ["1", "2"] }] } });
});

test("test map agent filter", async () => {
  const graph_data = {
    version: graphDataLatestVersion,

    nodes: {
      source: {
        value: { data: ["1", "2"] },
      },
      nested1: {
        inputs: [":source.data"],
        agent: "mapAgent",
        graph: {
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
              inputs: [":echo"],
              isResult: true,
            },
          },
        },
        isResult: true,
      },
    },
  };

  const graph = new GraphAI({ ...graph_data }, { ...agents }, { agentFilters });
  const result = await graph.run();
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { nested1: { bypassAgent: [[{ simple: ["1", "2"] }], [{ simple: ["1", "2"] }]] } });
});
