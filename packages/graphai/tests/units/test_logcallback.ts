import { GraphAI, GraphData } from "@/index";
import { graphDataLatestVersion } from "~/common";
import * as agents from "~/test_agents";

import test from "node:test";
import assert from "node:assert";

const graph_data: GraphData = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    testAgent: {
      agent: "copyAgent",
      inputs: {
        text: ":message",
      },
    },
    testAgent2: {
      agent: "copyAgent",
      inputs: {
        text: ":testAgent.text",
      },
    },
  },
};

test("test logCallback", async () => {
  const logs: Record<string, string | undefined>[] = [];
  const graph = new GraphAI(graph_data, agents);
  graph.onLogCallback = (log) => {
    const { nodeId, state, agentId } = log;
    logs.push({ nodeId, state, agentId });
  };
  await graph.run(true);
  assert.deepStrictEqual(logs, [
    { nodeId: "testAgent", state: "queued", agentId: "copyAgent" },
    { nodeId: "testAgent", state: "executing", agentId: "copyAgent" },
    { nodeId: "testAgent", state: "completed", agentId: "copyAgent" },
    { nodeId: "testAgent2", state: "queued", agentId: "copyAgent" },
    { nodeId: "testAgent2", state: "executing", agentId: "copyAgent" },
    { nodeId: "testAgent2", state: "completed", agentId: "copyAgent" },
  ]);
});

test("test logRegister", async () => {
  const logs1: Record<string, string | undefined>[] = [];
  const logs2: Record<string, string | undefined>[] = [];
  const graph = new GraphAI(graph_data, agents);
  graph.registerCallback((log) => {
    const { nodeId, state } = log;
    logs1.push({ nodeId, state });
  });
  graph.registerCallback((log) => {
    const { state, agentId } = log;
    logs2.push({ state, agentId });
  });
  await graph.run(true);
  assert.deepStrictEqual(logs1, [
    { nodeId: "testAgent", state: "queued" },
    { nodeId: "testAgent", state: "executing" },
    { nodeId: "testAgent", state: "completed" },
    { nodeId: "testAgent2", state: "queued" },
    { nodeId: "testAgent2", state: "executing" },
    { nodeId: "testAgent2", state: "completed" },
  ]);
  assert.deepStrictEqual(logs2, [
    { state: "queued", agentId: "copyAgent" },
    { state: "executing", agentId: "copyAgent" },
    { state: "completed", agentId: "copyAgent" },
    { state: "queued", agentId: "copyAgent" },
    { state: "executing", agentId: "copyAgent" },
    { state: "completed", agentId: "copyAgent" },
  ]);
});
