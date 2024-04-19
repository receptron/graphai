import { GraphAI } from "@/graphai";
import { defaultTestAgents } from "~/agents/agents";

import test from "node:test";
import assert from "node:assert";

// import { sleep } from "@/utils/utils";

test("test base", async () => {
  const graph_data = {
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: "hello",
        },
      },
      bypassAgent: {
        agentId: "bypassAgent",
        inputs: ["echo"],
      },
      bypassAgent2: {
        agentId: "bypassAgent",
        inputs: ["bypassAgent"],
      },
    },
  };

  const graph = new GraphAI(graph_data, defaultTestAgents);
  const asString = graph.asString();
  assert.deepStrictEqual(asString, ["echo: waiting bypassAgent", "bypassAgent: waiting bypassAgent2", "bypassAgent2: waiting "].join("\n"));

  const beforeResult = graph.results();
  assert.deepStrictEqual(beforeResult, {});

  const beforeResultOf = graph.resultsOf([{ nodeId: "bypassAgent" }]);
  assert.deepStrictEqual(beforeResultOf, [undefined]);

  await graph.run();

  const afterResult = graph.results();
  assert.deepStrictEqual(afterResult, {
    echo: { message: "hello" },
    bypassAgent: { message: "hello" },
    bypassAgent2: { message: "hello" },
  });

  const afterResultOf = graph.resultsOf([{ nodeId: "bypassAgent" }]);
  assert.deepStrictEqual(afterResultOf, [{ message: "hello" }]);
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

test("test base", async () => {
  const { injectAgent, injectAgentResolver } = injectAgentGenerator();

  const graph_data = {
    nodes: {
      echo: {
        agentId: "echoAgent",
      },
      bypassAgent: {
        agentId: "injectAgent",
        inputs: ["echo"],
      },
      bypassAgent2: {
        agentId: "bypassAgent",
        inputs: ["bypassAgent"],
      },
    },
  };

  const graph = new GraphAI(graph_data, { ...defaultTestAgents, injectAgent });
  const asString = graph.asString();
  assert.deepStrictEqual(asString, ["echo: waiting bypassAgent", "bypassAgent: waiting bypassAgent2", "bypassAgent2: waiting "].join("\n"));

  const beforeResult = graph.results();
  assert.deepStrictEqual(beforeResult, {});

  const beforeResultOf = graph.resultsOf([{ nodeId: "bypassAgent" }]);
  assert.deepStrictEqual(beforeResultOf, [undefined]);

  (async () => {
    await graph.run();

    const afterResult = graph.results();
    console.log(afterResult);
    assert.deepStrictEqual(afterResult, {
      echo: {},
      bypassAgent: { message: "inject" },
      bypassAgent2: { message: "inject" },
    });

    const afterResultOf = graph.resultsOf([{ nodeId: "bypassAgent" }]);
    assert.deepStrictEqual(afterResultOf, [{ message: "inject" }]);
  })();

  // await sleep(500);
  injectAgentResolver({ message: "inject" });
});
