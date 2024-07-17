import { GraphAI, AgentFilterFunction } from "@/index";

import * as agents from "~/test_agents";
import { graphDataLatestVersion } from "~/common";

import test from "node:test";
import assert from "node:assert";

const httpAgentFilter: AgentFilterFunction = async (context, next) => {
  return next(context);
};

test("test filterParams on agent filter", async () => {
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
          baseUrl: "http://localhost:8085/agentFilters/",
          stream: true,
        },
      },
      agentIds: ["echoAgent"],
    },
  ];

  const graph = new GraphAI({ ...graph_data }, { ...agents }, { agentFilters });

  const result = await graph.run();
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { bypassAgent: [{ agentServer: { baseUrl: "http://localhost:8085/agentFilters/", stream: true } }] });
});

test("test filterParams on node", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          filterParams: true,
        },
        filterParams: {
          agentServer: {
            baseUrl: "http://localhost:8081/nodeParameter/",
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
      agentIds: ["echoAgent"],
    },
  ];

  const graph = new GraphAI({ ...graph_data }, { ...agents }, { agentFilters });

  const result = await graph.run();
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { bypassAgent: [{ agentServer: { baseUrl: "http://localhost:8081/nodeParameter/" } }] });
});

test("test filterParams on agent filter and node. Then node.ts use filterParams on node", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          filterParams: true,
        },
        filterParams: {
          agentServer: {
            baseUrl: "http://localhost:8081/nodeParameter/",
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
          baseUrl: "http://localhost:8085/agentFilters/",
          stream: true,
        },
      },
      agentIds: ["echoAgent"],
    },
  ];

  const graph = new GraphAI({ ...graph_data }, { ...agents }, { agentFilters });

  const result = await graph.run();
  console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { bypassAgent: [{ agentServer: { baseUrl: "http://localhost:8081/nodeParameter/" } }] });
});

test("test filterParams on each agent", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          filterParams: true,
        },
        filterParams: {
          agentServer: {
            baseUrl: "http://localhost:8081/nodeParameter/",
          },
        },
      },
      echo2: {
        agent: "echoAgent",
        params: {
          filterParams: true,
        },
        filterParams: {
          agentServer: {
            baseUrl: "http://localhost:8081/nodeParameter2/",
          },
        },
      },
      bypassAgent: {
        agent: "bypassAgent",
        inputs: [":echo", ":echo2"],
        isResult: true,
      },
    },
  };
  const agentFilters = [
    {
      name: "httpAgentFilter",
      agent: httpAgentFilter,
      agentIds: ["echoAgent"],
    },
  ];

  const graph = new GraphAI({ ...graph_data }, { ...agents }, { agentFilters });

  const result = await graph.run();
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, {
    bypassAgent: [{ agentServer: { baseUrl: "http://localhost:8081/nodeParameter/" } }, { agentServer: { baseUrl: "http://localhost:8081/nodeParameter2/" } }],
  });
});

test("test filterParams on agent filter", async () => {
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
          baseUrl: "http://localhost:8085/agentFilters/",
          stream: true,
        },
      },
      agentIds: ["echoAgent"],
    },
    {
      name: "httpAgentFilter",
      agent: httpAgentFilter,
      filterParams: {
        agentServer: {
          baseUrl: "http://localhost:8085/agentFilters2/",
          stream: true,
        },
      },
      agentIds: ["echoAgent"],
    },
  ];

  const graph = new GraphAI({ ...graph_data }, { ...agents }, { agentFilters });

  const result = await graph.run();
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { bypassAgent: [{ agentServer: { baseUrl: "http://localhost:8085/agentFilters/", stream: true } }] });
});
