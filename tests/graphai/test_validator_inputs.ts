import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "~/agents/agents";
import { anonymization } from "~/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        agentId: "echoAgent",
      },
      computed2: {
        agentId: "echoAgent",
        inputs: ["dummy"],
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "Inputs not match: NodeId computed2, Inputs: dummy" },
  );
});

test("test computed node validation value", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        agentId: "echoAgent",
        inputs: ["computed2"],
      },
      computed2: {
        agentId: "echoAgent",
        inputs: ["computed1"],
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "No Initial Runnning Node" },
  );
});

test("test no initial running node", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        agentId: "echoAgent",
        inputs: ["computed2"],
      },
      computed2: {
        agentId: "echoAgent",
        inputs: ["computed1"],
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "No Initial Runnning Node" },
  );
});

test("test closed loop validation", async () => {
  const graph_data = anonymization({
    nodes: {
      computed1: {
        agentId: "echoAgent",
      },
      computed2: {
        agentId: "echoAgent",
        inputs: ["computed1"],
      },
      computed3: {
        agentId: "echoAgent",
        inputs: ["computed3"],
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "Some nodes are not executed: computed3" },
  );
});
