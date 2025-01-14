import { nestedAgent } from "@/index";
import { nestedAgentGenerator } from "@/graph_agents/nested_agent";

import { sleepAndMergeAgent } from "@graphai/sleeper_agents";
import { defaultTestContext, graphDataLatestVersion } from "graphai";

import test from "node:test";
import assert from "node:assert";

test("test nest agent", async () => {
  const result = await nestedAgent.agent({
    ...defaultTestContext,
    forNestedGraph: {
      agents: { sleepAndMergeAgent },
      graphOptions: {},
      graphData: {
        version: graphDataLatestVersion,
        nodes: {
          node1: {
            agent: "sleepAndMergeAgent",
            inputs: { array: [":prop1", ":prop2", ":prop3"] },
            isResult: true,
          },
        },
      },
    },
    namedInputs: { prop1: { apple: "red" }, prop2: { lemon: "yellow" }, prop3: { orange: "orange" } },
  });
  assert.deepStrictEqual(result, {
    node1: { apple: "red", lemon: "yellow", orange: "orange" },
  });
});

test("test nest agent generator", async () => {
  const graphData = {
    version: graphDataLatestVersion,
    nodes: {
      node1: {
        agent: "sleepAndMergeAgent",
        inputs: { array: [":prop1", ":prop2", ":prop3"] },
        isResult: true,
      },
    },
  };
  const testAgent = nestedAgentGenerator(graphData);

  const result = await testAgent({
    ...defaultTestContext,
    forNestedGraph: {
      agents: { sleepAndMergeAgent },
      graphOptions: {},
      graphData: { version: 0, nodes: {} }, // dummy
    },
    namedInputs: { prop1: { apple: "red" }, prop2: { lemon: "yellow" }, prop3: { orange: "orange" } },
  });
  assert.deepStrictEqual(result, {
    node1: { apple: "red", lemon: "yellow", orange: "orange" },
  });
});
