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
    childGraph: {
      inputs: {
        text: ":testAgent2.text",
      },
      agent: "nestedAgent",
      graph: {
        version: graphDataLatestVersion,
        nodes: {
          nestedTestAgent: {
            agent: "copyAgent",
            inputs: {
              text: ":text",
            },
          },
          nestedTestAgent2: {
            agent: "copyAgent",
            inputs: {
              text: ":nestedTestAgent.text",
            },
          },
        },
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
    { nodeId: "childGraph", state: "queued", agentId: "nestedAgent" },
    { nodeId: "childGraph", state: "executing", agentId: "nestedAgent" },
    { nodeId: "nestedTestAgent", state: "queued", agentId: "copyAgent" },
    {
      nodeId: "nestedTestAgent",
      state: "executing",
      agentId: "copyAgent",
    },
    {
      nodeId: "nestedTestAgent",
      state: "completed",
      agentId: "copyAgent",
    },
    { nodeId: "nestedTestAgent2", state: "queued", agentId: "copyAgent" },
    {
      nodeId: "nestedTestAgent2",
      state: "executing",
      agentId: "copyAgent",
    },
    {
      nodeId: "nestedTestAgent2",
      state: "completed",
      agentId: "copyAgent",
    },
    { nodeId: "childGraph", state: "completed", agentId: "nestedAgent" },
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
    { nodeId: "childGraph", state: "queued" },
    { nodeId: "childGraph", state: "executing" },
    { nodeId: "nestedTestAgent", state: "queued" },
    { nodeId: "nestedTestAgent", state: "executing" },
    { nodeId: "nestedTestAgent", state: "completed" },
    { nodeId: "nestedTestAgent2", state: "queued" },
    { nodeId: "nestedTestAgent2", state: "executing" },
    { nodeId: "nestedTestAgent2", state: "completed" },
    { nodeId: "childGraph", state: "completed" },
  ]);
  assert.deepStrictEqual(logs2, [
    { state: "queued", agentId: "copyAgent" },
    { state: "executing", agentId: "copyAgent" },
    { state: "completed", agentId: "copyAgent" },
    { state: "queued", agentId: "copyAgent" },
    { state: "executing", agentId: "copyAgent" },
    { state: "completed", agentId: "copyAgent" },
    { state: "queued", agentId: "nestedAgent" },
    { state: "executing", agentId: "nestedAgent" },
    { state: "queued", agentId: "copyAgent" },
    { state: "executing", agentId: "copyAgent" },
    { state: "completed", agentId: "copyAgent" },
    { state: "queued", agentId: "copyAgent" },
    { state: "executing", agentId: "copyAgent" },
    { state: "completed", agentId: "copyAgent" },
    { state: "completed", agentId: "nestedAgent" },
  ]);
});
