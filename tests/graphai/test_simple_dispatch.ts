import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";
import { fileBaseName } from "~/utils/file_utils";

import { defaultTestAgents } from "@/utils/test_agents";

import test from "node:test";
import assert from "node:assert";

const dispatchAgentGenerator = (selectedNodeId: string) => {
  const dispatchAgent: AgentFunction<{ delay: number; fail: boolean }, Record<string, any>, Record<string, any>> = async ({ debugInfo: { nodeId } }) => {
    if (nodeId === selectedNodeId) {
      return { next: { from: nodeId } };
    }
    return {};
  };
  return dispatchAgent;
};

const dispatchGraph = {
  version: 0.2,
  nodes: {
    select1: {
      agentId: "dispatchAgent",
    },
    select2: {
      agentId: "dispatchAgent",
    },
    ghost: {
      agentId: "sleeperAgent",
      params: {
        duration: 20,
      },
      inputs: ["select1.next", "select2.next"],
      anyInput: true,
    },
    node: {
      agentId: "mergeNodeIdAgent",
    },
    merge: {
      inputs: ["node", "ghost"],
      agentId: "mergeNodeIdAgent",
    },
    result: {
      inputs: ["merge"],
      agentId: "mergeNodeIdAgent",
    },
  },
};

test("test select 1", async () => {
  const dispatchAgent = dispatchAgentGenerator("select1");
  const result = await graphDataTestRunner(fileBaseName(__filename) + "_1", dispatchGraph, { dispatchAgent, ...defaultTestAgents });
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
  const result = await graphDataTestRunner(fileBaseName(__filename) + "_2", dispatchGraph, { dispatchAgent, ...defaultTestAgents });
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
  version: 0.2,
  nodes: {
    select: {
      agentId: "dispatchAgent",
    },
    ghost1: {
      agentId: "sleeperAgent",
      params: {
        duration: 20,
      },
      inputs: ["select.next1"],
      anyInput: true,
    },
    ghost2: {
      agentId: "sleeperAgent",
      params: {
        duration: 20,
      },
      inputs: ["select.next2"],
      anyInput: true,
    },
    ghost3: {
      agentId: "sleeperAgent",
      params: {
        duration: 20,
      },
      inputs: ["select.next3"],
      anyInput: true,
    },
    result1: {
      inputs: ["ghost1"],
      agentId: "mergeNodeIdAgent",
    },
    result2: {
      inputs: ["ghost2"],
      agentId: "mergeNodeIdAgent",
    },
    result3: {
      inputs: ["ghost3"],
      agentId: "mergeNodeIdAgent",
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
  return dispatchAgent;
};

test("test next 1", async () => {
  const dispatchAgent = dispatchAgentGenerator2(["next1"]);
  const result = await graphDataTestRunner(fileBaseName(__filename) + "_3", dispatchGraph2, { dispatchAgent, ...defaultTestAgents });
  // console.log(result);
  assert.deepStrictEqual(result, {
    select: { next1: { from: "select" } },
    ghost1: { from: "select" },
    result1: { result1: "hello", from: "select" },
  });
});

test("test next 3", async () => {
  const dispatchAgent = dispatchAgentGenerator2(["next3"]);
  const result = await graphDataTestRunner(fileBaseName(__filename) + "_4", dispatchGraph2, { dispatchAgent, ...defaultTestAgents });
  assert.deepStrictEqual(result, {
    select: { next3: { from: "select" } },
    ghost3: { from: "select" },
    result3: { result3: "hello", from: "select" },
  });
});

test("test next 2, 3", async () => {
  const dispatchAgent = dispatchAgentGenerator2(["next2", "next3"]);
  const result = await graphDataTestRunner(fileBaseName(__filename) + "_5", dispatchGraph2, { dispatchAgent, ...defaultTestAgents });
  // console.log(result);
  assert.deepStrictEqual(result, {
    select: { next2: { from: "select" }, next3: { from: "select" } },
    ghost2: { from: "select" },
    ghost3: { from: "select" },
    result2: { result2: "hello", from: "select" },
    result3: { result3: "hello", from: "select" },
  });
});
