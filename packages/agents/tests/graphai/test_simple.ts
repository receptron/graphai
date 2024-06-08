import { GraphAI, defaultAgentInfo, sleep } from "graphai";

import * as agents from "@graphai/vanilla";

import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: 0.3,
  nodes: {
    echo: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
    },
    bypassAgent: {
      agent: "bypassAgent",
      inputs: [":echo"],
    },
    bypassAgent2: {
      agent: "bypassAgent",
      inputs: [":bypassAgent"],
    },
  },
};

const graph_injection_data = {
  version: 0.3,
  nodes: {
    echo: {
      agent: "echoAgent",
    },
    bypassAgent: {
      agent: "injectAgent",
      inputs: [":echo"],
    },
    bypassAgent2: {
      agent: "bypassAgent",
      inputs: [":bypassAgent"],
    },
  },
};

test("test graph", async () => {
  const graph = new GraphAI(graph_data, agents);
  const asString = graph.asString();
  assert.deepStrictEqual(asString, ["echo: waiting bypassAgent", "bypassAgent: waiting bypassAgent2", "bypassAgent2: waiting "].join("\n"));

  const beforeResult = graph.results(true);
  assert.deepStrictEqual(beforeResult, {});

  const beforeResultOf = graph.resultsOf([{ nodeId: "bypassAgent" }]);
  assert.deepStrictEqual(beforeResultOf, [undefined]);

  await graph.run(true);

  const afterResult = graph.results(true);
  assert.deepStrictEqual(afterResult, {
    echo: { message: "hello" },
    bypassAgent: [{ message: "hello" }],
    bypassAgent2: [[{ message: "hello" }]],
  });

  const afterResultOf = graph.resultsOf([{ nodeId: "bypassAgent" }]);
  assert.deepStrictEqual(afterResultOf, [[{ message: "hello" }]]);
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
  assert.deepStrictEqual(asString, ["echo: waiting bypassAgent", "bypassAgent: waiting bypassAgent2", "bypassAgent2: waiting "].join("\n"));

  const beforeResult = graph.results(true);
  assert.deepStrictEqual(beforeResult, {});

  const beforeResultOf = graph.resultsOf([{ nodeId: "bypassAgent" }]);
  assert.deepStrictEqual(beforeResultOf, [undefined]);

  (async () => {
    await graph.run(true);

    const afterResult = graph.results(true);
    assert.deepStrictEqual(afterResult, {
      echo: {},
      bypassAgent: { message: "inject" },
      bypassAgent2: [{ message: "inject" }],
    });

    const afterResultOf = graph.resultsOf([{ nodeId: "bypassAgent" }]);
    assert.deepStrictEqual(afterResultOf, [{ message: "inject" }]);
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
