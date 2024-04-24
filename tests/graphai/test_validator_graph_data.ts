import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "~/agents/agents";

import test from "node:test";
import assert from "node:assert";

test("test loop error", async () => {
  const graphdata = {
    loop: {},
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: "hello",
        },
      },
    },
  };

  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graphdata, defaultTestAgents);
    },
    { name: "Error", message: "Either count or while is required in loop" },
  );
});

test("test loop error 1", async () => {
  const graphdata = {
    loop: {
      count: 1,
      while: "123",
    },
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: "hello",
        },
      },
    },
  };

  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graphdata, defaultTestAgents);
    },
    { name: "Error", message: "Both A and B cannot be set" },
  );
});
