import { anonymization, rejectTest } from "@receptron/test_utils";
import { graphDataLatestVersion } from "../common";
import { validateGraphData } from "../../src/validator";
import type { ConcurrencyConfig } from "../../src/type";

import test from "node:test";
import assert from "node:assert";

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

test("test concurrency labels null is rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: null },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.labels must be an object");
});

// Top-level concurrency malformed shapes
test("test concurrency null rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: null,
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency must be an integer");
});

test("test concurrency boolean rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: true,
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency must be an integer");
});

test("test concurrency array rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: [],
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency must be an integer");
});

// Concurrency.global malformed shapes
test("test concurrency.global string rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: "5" },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.global must be an integer");
});

test("test concurrency.global null rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: null },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.global must be an integer");
});

test("test concurrency.global negative rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: -1 },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.global must be a positive integer");
});

test("test concurrency.global float rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 1.5 },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.global must be an integer");
});

// Concurrency.labels.<key> malformed values
test("test concurrency.labels.<key> string rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: { openai: "3" } },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.labels.openai must be an integer");
});

test("test concurrency.labels.<key> null rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: { openai: null } },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.labels.openai must be an integer");
});

test("test concurrency.labels.<key> negative rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: { openai: -2 } },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.labels.openai must be a positive integer");
});

test("test concurrency.labels.<key> boolean rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: { openai: true } },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.labels.openai must be an integer");
});

test("test concurrency.labels.<key> object rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: { openai: { value: 3 } } },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.labels.openai must be an integer");
});

test("test concurrency.labels.<key> empty key still validated", async () => {
  // An empty-string key is unusual but the validator should still walk it.
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: { "": 0 } },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency.labels. must be a positive integer");
});

// Reject extra keys on the concurrency object so typos do not silently
// disable enforcement.
test("test concurrency object form extra key rejected", async () => {
  const graphdata = anonymization({
    version: graphDataLatestVersion,
    concurrency: { global: 5, foo: 1 },
    nodes,
  });
  await rejectTest(__dirname, graphdata, "Concurrency object does not allow foo");
});

// Reject non-plain-object shapes that would otherwise pass typeof "object"
// and yield no entries via Object.entries -- silently disabling enforcement.
// These tests intentionally bypass anonymization (which JSON-roundtrips and
// would convert Map/Date/class instances to plain objects/strings, hiding
// what the validator actually sees in code that constructs graph data
// programmatically).
test("test concurrency Map rejected", () => {
  const graphdata = {
    version: graphDataLatestVersion,
    concurrency: new Map([["global", 5]]) as unknown as ConcurrencyConfig,
    nodes,
  };
  assert.throws(() => validateGraphData(graphdata, ["echoAgent"]), /Concurrency must be an integer/);
});

test("test concurrency Date rejected", () => {
  const graphdata = {
    version: graphDataLatestVersion,
    concurrency: new Date() as unknown as ConcurrencyConfig,
    nodes,
  };
  assert.throws(() => validateGraphData(graphdata, ["echoAgent"]), /Concurrency must be an integer/);
});

test("test concurrency.labels Map rejected", () => {
  const graphdata = {
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: new Map([["openai", 3]]) as unknown as Record<string, number> },
    nodes,
  };
  assert.throws(() => validateGraphData(graphdata, ["echoAgent"]), /Concurrency\.labels must be an object/);
});

test("test concurrency.labels class instance rejected", () => {
  class Limits {
    openai = 3;
  }
  const graphdata = {
    version: graphDataLatestVersion,
    concurrency: { global: 5, labels: new Limits() as unknown as Record<string, number> },
    nodes,
  };
  assert.throws(() => validateGraphData(graphdata, ["echoAgent"]), /Concurrency\.labels must be an object/);
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
