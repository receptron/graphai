import { AgentFunction, agentInfoWrapper } from "graphai";
import { graphDataTestRunner, fileBaseName } from "@receptron/test_utils";
import * as agents from "@/index";

import test from "node:test";
import assert from "node:assert";

const dispatchAgentGenerator = (selectedNodeId: string) => {
  const dispatchAgent: AgentFunction<{ delay: number; fail: boolean }, Record<string, any>, Record<string, any>> = async ({ debugInfo: { nodeId } }) => {
    if (nodeId === selectedNodeId) {
      return { next: { from: nodeId } };
    }
    return {};
  };
  return agentInfoWrapper(dispatchAgent);
};

const dispatchGraph = {
  version: 0.5,
  nodes: {
    select1: {
      agent: "dispatchAgent",
    },
    select2: {
      agent: "dispatchAgent",
    },
    ghost: {
      agent: "sleepAndMergeAgent",
      params: {
        duration: 20,
      },
      inputs: { array: [":select1.next", ":select2.next"] },
      anyInput: true,
    },
    node: {
      agent: "mergeNodeIdAgent",
      inputs: { array: [] },
    },
    merge: {
      inputs: { array: [":node", ":ghost"] },
      agent: "mergeNodeIdAgent",
    },
    result: {
      inputs: { array: [":merge"] },
      agent: "mergeNodeIdAgent",
    },
  },
};

test("test select 1", async () => {
  const dispatchAgent = dispatchAgentGenerator("select1");
  const result = await graphDataTestRunner(__dirname, fileBaseName(__filename) + "_1", dispatchGraph, { dispatchAgent, ...agents });
  assert.deepStrictEqual(result, {
    ghost: { from: "select1" },
    node: { node: "hello" },
    select1: { next: { from: "select1" } },
    select2: {},
    merge: { merge: "hello", node: "hello", from: "select1" },
    result: { result: "hello", merge: "hello", node: "hello", from: "select1" },
  });
});

test("test select 2", async () => {
  const dispatchAgent = dispatchAgentGenerator("select2");
  const result = await graphDataTestRunner(__dirname, fileBaseName(__filename) + "_2", dispatchGraph, { dispatchAgent, ...agents });
  assert.deepStrictEqual(result, {
    ghost: { from: "select2" },
    node: { node: "hello" },
    select1: {},
    select2: { next: { from: "select2" } },
    merge: { merge: "hello", node: "hello", from: "select2" },
    result: { result: "hello", merge: "hello", node: "hello", from: "select2" },
  });
});

const dispatchGraph2 = {
  version: 0.5,
  nodes: {
    select: {
      agent: "dispatchAgent",
    },
    ghost1: {
      agent: "sleepAndMergeAgent",
      params: {
        duration: 20,
      },
      inputs: { array: [":select.next1"] },
      anyInput: true,
    },
    ghost2: {
      agent: "sleepAndMergeAgent",
      params: {
        duration: 20,
      },
      inputs: { array: [":select.next2"] },
      anyInput: true,
    },
    ghost3: {
      agent: "sleepAndMergeAgent",
      params: {
        duration: 20,
      },
      inputs: { array: [":select.next3"] },
      anyInput: true,
    },
    result1: {
      inputs: { array: [":ghost1"] },
      agent: "mergeNodeIdAgent",
    },
    result2: {
      inputs: { array: [":ghost2"] },
      agent: "mergeNodeIdAgent",
    },
    result3: {
      inputs: { array: [":ghost3"] },
      agent: "mergeNodeIdAgent",
    },
  },
};

const dispatchAgentGenerator2 = (selectedKeys: string[]) => {
  const dispatchAgent: AgentFunction<{ delay: number; fail: boolean }, Record<string, any>, Record<string, any>> = async ({ debugInfo: { nodeId } }) => {
    return selectedKeys.reduce((tmp: Record<string, any>, current) => {
      tmp[current] = { from: nodeId };
      return tmp;
    }, {});
  };
  return agentInfoWrapper(dispatchAgent);
};

test("test next 1", async () => {
  const dispatchAgent = dispatchAgentGenerator2(["next1"]);
  const result = await graphDataTestRunner(__dirname, fileBaseName(__filename) + "_3", dispatchGraph2, { dispatchAgent, ...agents });
  // console.log(result);
  assert.deepStrictEqual(result, {
    select: { next1: { from: "select" } },
    ghost1: { from: "select" },
    result1: { result1: "hello", from: "select" },
  });
});

test("test next 3", async () => {
  const dispatchAgent = dispatchAgentGenerator2(["next3"]);
  const result = await graphDataTestRunner(__dirname, fileBaseName(__filename) + "_4", dispatchGraph2, { dispatchAgent, ...agents });
  assert.deepStrictEqual(result, {
    select: { next3: { from: "select" } },
    ghost3: { from: "select" },
    result3: { result3: "hello", from: "select" },
  });
});

test("test next 2, 3", async () => {
  const dispatchAgent = dispatchAgentGenerator2(["next2", "next3"]);
  const result = await graphDataTestRunner(__dirname, fileBaseName(__filename) + "_5", dispatchGraph2, { dispatchAgent, ...agents });
  // console.log(result);
  assert.deepStrictEqual(result, {
    select: { next2: { from: "select" }, next3: { from: "select" } },
    ghost2: { from: "select" },
    ghost3: { from: "select" },
    result2: { result2: "hello", from: "select" },
    result3: { result3: "hello", from: "select" },
  });
});
