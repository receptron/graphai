import { nestedAgent } from "@/index";
import { nestedAgentGenerator } from "@/generator";

import { sleepAndMergeAgent } from "@graphai/sleeper_agents";
import { defaultTestContext, graphDataLatestVersion, agentInfoWrapper } from "graphai";

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
  const testAgentInfo = agentInfoWrapper(testAgent);
  testAgentInfo.hasGraphData = true;
  const result = await testAgent({
    ...defaultTestContext,
    forNestedGraph: {
      agents: { sleepAndMergeAgent, testAgent: testAgentInfo },
      graphOptions: {},
    },
    namedInputs: { prop1: { apple: "red" }, prop2: { lemon: "yellow" }, prop3: { orange: "orange" } },
  });
  assert.deepStrictEqual(result, {
    node1: { apple: "red", lemon: "yellow", orange: "orange" },
  });
});
