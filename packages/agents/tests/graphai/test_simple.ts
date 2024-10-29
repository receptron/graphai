import { GraphAI, defaultAgentInfo, sleep } from "graphai";

import * as agents from "@graphai/vanilla";

import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: 0.5,
  nodes: {
    echo: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
    },
    copyAgent: {
      agent: "copyAgent",
      params: { namedKey: "item" },
      inputs: { item: [":echo"] },
    },
    copyAgent2: {
      agent: "copyAgent",
      params: { namedKey: "item" },
      inputs: { item: [":copyAgent"] },
    },
  },
};

const graph_injection_data = {
  version: 0.5,
  nodes: {
    echo: {
      agent: "echoAgent",
    },
    copyAgent: {
      agent: "injectAgent",
      inputs: { item: [":echo"] },
    },
    copyAgent2: {
      agent: "copyAgent",
      params: { namedKey: "item" },
      inputs: { item: [":copyAgent"] },
    },
  },
};

test("test graph", async () => {
  const graph = new GraphAI(graph_data, agents);
  const asString = graph.asString();
  assert.deepStrictEqual(asString, ["echo: waiting copyAgent", "copyAgent: waiting copyAgent2", "copyAgent2: waiting "].join("\n"));

  const beforeResult = graph.results(true);
  assert.deepStrictEqual(beforeResult, {});

  const beforeResultOf = graph.resultOf({ nodeId: "copyAgent" });
  assert.deepStrictEqual(beforeResultOf, undefined);

  await graph.run(true);

  const afterResult = graph.results(true);
  assert.deepStrictEqual(afterResult, {
    echo: { message: "hello" },
    copyAgent: [{ message: "hello" }],
    copyAgent2: [[{ message: "hello" }]],
  });

  const afterResultOf = graph.resultOf({ nodeId: "copyAgent" });
  assert.deepStrictEqual(afterResultOf, [{ message: "hello" }]);
});

const injectAgentGenerator = () => {
  let resolve = (__ret: unknown) => {};
  let reject = () => {};
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const injectAgent = {
    ...defaultAgentInfo,
    agent: () => {
      return promise;
    },
    mock: () => {
      return promise;
    },
  };

  return {
    injectAgent,
    injectAgentResolver: resolve,
    injectAgentRejector: reject,
  };
};

test("test injection", async () => {
  const { injectAgent, injectAgentResolver } = injectAgentGenerator();

  const graph = new GraphAI(graph_injection_data, { ...agents, injectAgent });
  const asString = graph.asString();
  assert.deepStrictEqual(asString, ["echo: waiting copyAgent", "copyAgent: waiting copyAgent2", "copyAgent2: waiting "].join("\n"));

  const beforeResult = graph.results(true);
  assert.deepStrictEqual(beforeResult, {});

  const beforeResultOf = graph.resultOf({ nodeId: "copyAgent" });
  assert.deepStrictEqual(beforeResultOf, undefined);

  (async () => {
    await graph.run(true);

    const afterResult = graph.results(true);
    assert.deepStrictEqual(afterResult, {
      echo: {},
      copyAgent: { message: "inject" },
      copyAgent2: [{ message: "inject" }],
    });

    const afterResultOf = graph.resultOf({ nodeId: "copyAgent" });
    assert.deepStrictEqual(afterResultOf, { message: "inject" });
  })();

  injectAgentResolver({ message: "inject" });
});

test("test running", async () => {
  const { injectAgent, injectAgentResolver } = injectAgentGenerator();

  const graph = new GraphAI(graph_injection_data, { ...agents, injectAgent });
  assert.equal(false, graph.isRunning());

  (async () => {
    await graph.run(true);
    assert.equal(false, graph.isRunning());
  })();

  assert.equal(true, graph.isRunning());
  injectAgentResolver({ message: "inject" });
  await sleep(100);
  assert.equal(false, graph.isRunning());
});
