import { anonymization, rejectTest } from "@receptron/test_utils";
import { graphDataLatestVersion } from "../common";
import { validateGraphData } from "../../src/validator";

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

  await rejectTest(__dirname, graphdata, "Loop: Either count or while is required in loop");
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

test("test concurrency valid number", async () => {
  const graphdata = {
    version: graphDataLatestVersion,
    concurrency: 5,
    nodes,
  };
  validateGraphData(graphdata, ["echoAgent"]);
});

test("test concurrency valid number one", async () => {
  const graphdata = {
    version: graphDataLatestVersion,
    concurrency: 1,
    nodes,
  };
  validateGraphData(graphdata, ["echoAgent"]);
});

test("test concurrency undefined is allowed", async () => {
  const graphdata = {
    version: graphDataLatestVersion,
    nodes,
  };
  validateGraphData(graphdata, ["echoAgent"]);
});

// ConcurrencyConfig (object form) tests
test("test concurrency object form valid", async () => {
  const graphdata = {
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: { openai: 2, vertex: 3 } },
    nodes,
  };
  validateGraphData(graphdata, ["echoAgent"]);
});

test("test concurrency object form without labels", async () => {
  const graphdata = {
    version: graphDataLatestVersion,
    concurrency: { global: 5 },
    nodes,
  };
  validateGraphData(graphdata, ["echoAgent"]);
});

test("test concurrency object form missing global", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { labels: { openai: 2 } },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency object must have a global field");
});

test("test concurrency object form invalid global", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 0 },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.global must be a positive integer");
});

test("test concurrency object form invalid label value", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: { openai: 0 } },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.labels.openai must be a positive integer");
});

test("test concurrency object form non-integer label value", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: { openai: 1.5 } },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.labels.openai must be an integer");
});

test("test concurrency labels not an object", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: [] },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.labels must be an object");
});

// metadata test
test("test metadata", async () => {
  const graphdata = {
    version: graphDataLatestVersion,
    nodes,
    metadata: {},
  };
  validateGraphData(graphdata, ["echoAgent"]);
});
