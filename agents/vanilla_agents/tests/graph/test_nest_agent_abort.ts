import { GraphAI, GraphData, sleep, NodeState, graphDataLatestVersion, AgentFilterFunction } from "graphai";
import * as agents from "@/index";

import test from "node:test";
import assert from "node:assert";

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

const nested_graph_data: GraphData = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: ["Hello World 1", "Hello World 2", "Hello World 3"],
    },
    childGraph: {
      inputs: {
        rows: ":message",
      },
      agent: "mapAgent",
      graph: {
        version: graphDataLatestVersion,
        nodes: {
          sleep1: {
            agent: "sleeperAgent",
            params: {
              duration: 2000,
            },
            inputs: {
              text: ":row",
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
