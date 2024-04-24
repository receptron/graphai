import { rejectTest } from "~/utils/runner";
import { anonymization } from "~/utils/utils";

import test from "node:test";

const nodes = {
  echo: {
    agentId: "echoAgent",
    params: {
      message: "hello",
    },
  },
};

// loop test
test("test loop error", async () => {
  const graphdata = {
    loop: {},
    nodes,
  };

  await rejectTest(graphdata, "Loop: Either count or while is required in loop");
});

test("test loop error 1", async () => {
  const graphdata = {
    loop: {
      count: 1,
      while: "123",
    },
    nodes,
  };
  await rejectTest(graphdata, "Loop: Both count and while cannot be set");
});

// concurrency test
test("test concurrency error zero", async () => {
  const graphdata = {
    concurrency: 0,
    nodes,
  };
  await rejectTest(graphdata, "Concurrency must be a positive integer");
});

test("test concurrency error nagative", async () => {
  const graphdata = {
    concurrency: -1,
    nodes,
  };
  await rejectTest(graphdata, "Concurrency must be a positive integer");
});

test("test concurrency error float", async () => {
  const graphdata = {
    concurrency: 0.1,
    nodes,
  };
  await rejectTest(graphdata, "Concurrency must be an integer");
});

test("test concurrency error string", async () => {
  const graphdata = anonymization({
    concurrency: "1",
    nodes,
  });
  await rejectTest(graphdata, "Concurrency must be an integer");
});
