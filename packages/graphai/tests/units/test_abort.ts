import { GraphAI, GraphData, sleep, NodeState } from "@/index";
import { graphDataLatestVersion } from "~/common";
import * as agents from "~/test_agents";
import { GraphDataLoaderOption, AgentFilterFunction } from "@/type";

import test from "node:test";
import assert from "node:assert";

const graph_data: GraphData = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    sleep1: {
      agent: "sleeperAgent",
      params: {
        duration: 2000,
      },
      inputs: {
        text: ":message",
      },
      console: true,
    },
    sleep2: {
      agent: "sleeperAgent",
      params: {
        duration: 2000,
      },
      inputs: {
        text: ":sleep1.text",
      },
      console: true,
    },
  },
};
const simpleAgentFilter1: AgentFilterFunction = async (context, next) => {
  (async () => {
    while (context.debugInfo.state === NodeState.Executing) {
      await sleep(100);
      console.log(context.debugInfo.state);
    }
  })();
  return next(context);
};
const agentFilters = [
  {
    name: "simpleAgentFilter1",
    agent: simpleAgentFilter1,
  },
];

test("test graph", async () => {
  const graph = new GraphAI(graph_data, agents, { agentFilters });

  await assert.rejects(async () => {
    await Promise.all([
      (async () => {
        const result = await graph.run(true);
        assert.deepStrictEqual(result, {
          message: "Hello World",
          sleep1: {
            text: "Hello World",
          },
        });
      })(),
      (async () => {
        await sleep(500);
        graph.abort();
      })(),
    ]);
  });
});

////

const nested_graph_data: GraphData = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    childGraph: {
      inputs: {
        message: ":message",
      },
      agent: "nestedAgent",
      graph: {
        version: graphDataLatestVersion,
        nodes: {
          sleep1: {
            agent: "sleeperAgent",
            params: {
              duration: 2000,
            },
            inputs: {
              text: ":message",
            },
            console: true,
          },
          sleep2: {
            agent: "sleeperAgent",
            params: {
              duration: 2000,
            },
            inputs: {
              text: ":sleep1.text",
            },
            console: true,
          },
        },
      },
    },
  },
};

test("test graph", async () => {
  const graph = new GraphAI(nested_graph_data, agents, { agentFilters });

  await assert.rejects(async () => {
    await Promise.all([
      (async () => {
        const result = await graph.run(true);
        assert.deepStrictEqual(result, {
          message: "Hello World",
          sleep1: {
            text: "Hello World",
          },
        });
      })(),
      (async () => {
        await sleep(500);
        graph.abort();
      })(),
    ]);
  });
});
