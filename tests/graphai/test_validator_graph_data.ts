import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "~/agents/agents";
import { GraphData } from "@/graphai";

import test from "node:test";
import assert from "node:assert";

const rejectTest = async (graphdata: GraphData, errorMessage: string) => {
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graphdata, defaultTestAgents);
    },
    { name: "Error", message: errorMessage },
  );
};

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

  await rejectTest(graphdata, "Loop: Either count or while is required in loop");
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

  await rejectTest(graphdata, "Loop: Both count and while cannot be set");
});

test("test concurrency error 1", async () => {
  const graphdata = {
    concurrency: 0,
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: "hello",
        },
      },
    },
  };

  await rejectTest(graphdata, "Concurrency must be a positive integer");
});
