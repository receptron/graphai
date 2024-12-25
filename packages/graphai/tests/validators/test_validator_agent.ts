import { anonymization } from "@receptron/test_utils";
import { validateAgent, validateGraphData } from "@/validator";
import { ValidationError } from "@/validators/common";
import { graphDataLatestVersion } from "~/common";

import test from "node:test";
import assert from "node:assert";

test("test agent validation", async () => {
  await assert.rejects(
    async () => {
      validateAgent(anonymization({ testAgent: null }));
    },
    { name: "Error", message: new ValidationError("No Agent: testAgent is not in AgentFunctionInfoDictionary.").message },
  );

  await assert.rejects(
    async () => {
      validateAgent(anonymization({ testAgent: "test" }));
    },
    { name: "Error", message: new ValidationError("No Agent: testAgent is not in AgentFunctionInfoDictionary.").message },
  );

  await assert.rejects(
    async () => {
      validateAgent(anonymization({ testAgent: { agent: null } }));
    },
    { name: "Error", message: new ValidationError("No Agent: testAgent is not in AgentFunctionInfoDictionary.").message },
  );

  // not rejectes
  validateAgent(anonymization({ testAgent: { agent: "aaa" } }));
});

test("test agent relation validation", async () => {
  const graphData = {
    version: graphDataLatestVersion,
    nodes: {
      agentName: {
        value: "123",
      },
      test: {
        agent: ":agentName",
      },
    },
  };
  validateGraphData(graphData, []);
});

test("test agent relation validation", async () => {
  const graphData = {
    version: graphDataLatestVersion,
    nodes: {
      agentName: {
        value: "123",
      },
      test: {
        agent: ":nonExistAgent",
      },
    },
  };
  await assert.rejects(
    async () => {
      validateGraphData(graphData, []);
    },
    { name: "Error", message: new ValidationError("Agent not match: NodeId test, Inputs: nonExistAgent").message },
  );
});
