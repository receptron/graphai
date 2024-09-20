import { anonymization, rejectTest } from "@receptron/test_utils";
import { graphDataLatestVersion } from "~/common";

import test from "node:test";

const nodes = {
  echo: {
    agent: "echoAgent",
    params: {
      message: "hello",
    },
  },
};

// loop test
test("test loop error", async () => {
  const graphdata = {
    version: graphDataLatestVersion,
    loop: {},
    nodes,
  };

  await rejectTest(__dirname, graphdata, "Loop: Either count or while or doWhile is required in loop");
});

test("test loop error 1", async () => {
  const graphdata = {
    version: graphDataLatestVersion,
    loop: {
      count: 1,
      while: "123",
    },
    nodes,
  };
  await rejectTest(__dirname, graphdata, "Loop: Both count and while cannot be set");
});

// concurrency test
test("test concurrency error zero", async () => {
  const graphdata = {
    version: graphDataLatestVersion,
    concurrency: 0,
    nodes,
  };
  await rejectTest(__dirname, graphdata, "Concurrency must be a positive integer");
});

test("test concurrency error nagative", async () => {
  const graphdata = {
    version: graphDataLatestVersion,
    concurrency: -1,
    nodes,
  };
  await rejectTest(__dirname, graphdata, "Concurrency must be a positive integer");
});

test("test concurrency error float", async () => {
  const graphdata = {
    version: graphDataLatestVersion,
    concurrency: 0.1,
    nodes,
  };
  await rejectTest(__dirname, graphdata, "Concurrency must be an integer");
});

test("test concurrency error string", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: "1",
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency must be an integer");
});
