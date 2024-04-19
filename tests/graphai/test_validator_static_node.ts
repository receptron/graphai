import { graphDataTestRunner } from "~/utils/runner";
import { echoAgent } from "~/agents/agents";
import { anonymization } from "~/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test static node validation inputs", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        inputs: [""],
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, { echoAgent });
    },
    { name: "Error", message: "Static node does not allow inputs" },
  );
});

test("test static node validation anyInput", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        anyInput: true,
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, { echoAgent });
    },
    { name: "Error", message: "Static node does not allow anyInput" },
  );
});

test("test static node validation params", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        params: {},
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, { echoAgent });
    },
    { name: "Error", message: "Static node does not allow params" },
  );
});

test("test static node validation retry", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        retry: 1,
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, { echoAgent });
    },
    { name: "Error", message: "Static node does not allow retry" },
  );
});

test("test static node validation timeout", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        timeout: 1,
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, { echoAgent });
    },
    { name: "Error", message: "Static node does not allow timeout" },
  );
});

test("test static node validation fork", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        fork: 1,
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, { echoAgent });
    },
    { name: "Error", message: "Static node does not allow fork" },
  );
});
