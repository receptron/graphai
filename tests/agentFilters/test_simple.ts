import { GraphAI } from "@/graphai";
import { AgentFilterFunction } from "@/type";

import { defaultTestAgents } from "@/utils/test_agents";

import test from "node:test";
import assert from "node:assert";

const simpleAgentFilter1: AgentFilterFunction = async (context, next) => {
  if (context.params.filter) {
    context.params.filter.push("1");
  }
  return next(context);
};
const simpleAgentFilter2: AgentFilterFunction = async (context, next) => {
  if (context.params.filter) {
    context.params.filter.push("2");
  }
  return next(context);
};

const agentFilters = [simpleAgentFilter1, simpleAgentFilter2];
const callbackDictonary = {};

const graph_data = {
  version: 0.2,
  nodes: {
    echo: {
      agentId: "echoAgent",
      params: {
        message: "hello",
        filter: [],
      },
    },
    bypassAgent: {
      agentId: "bypassAgent",
      inputs: ["echo"],
      isResult: true,
    },
  },
};

test("test agent filter", async () => {
  const graph = new GraphAI(graph_data, { ...defaultTestAgents, ...callbackDictonary }, { agentFilters });
  const result = await graph.run();
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { bypassAgent: [{ message: "hello", filter: ["1", "2"] }] });
});
