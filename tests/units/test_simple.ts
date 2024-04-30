import { GraphAI } from "@/graphai";

import { defaultTestAgents } from "@/utils/test_agents";
import { graph_data, graph_injection_data } from "~/units/graph_data";
import { sleep } from "@/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test graph", async () => {
  const graph = new GraphAI(graph_data, defaultTestAgents);
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

  const injectAgent = () => {
    return promise;
  };

  return {
    injectAgent,
    injectAgentResolver: resolve,
    injectAgentRejector: reject,
  };
};

test("test injection", async () => {
  const { injectAgent, injectAgentResolver } = injectAgentGenerator();

  const graph = new GraphAI(graph_injection_data, { ...defaultTestAgents, injectAgent });
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

  const graph = new GraphAI(graph_injection_data, { ...defaultTestAgents, injectAgent });
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
