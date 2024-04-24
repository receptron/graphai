import { rejectTest } from "~/utils/runner";

import test from "node:test";

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
