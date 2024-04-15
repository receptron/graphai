import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";
import { mergeNodeIdAgent } from "~/agents/agents";

import test from "node:test";
import assert from "node:assert";

const dispatchAgentGenerator = (selectedNodeId: string) => {
  const dispatchAgent: AgentFunction<{ delay: number; fail: boolean }, Record<string, any>, Record<string, any>> = async (context) => {
    const { nodeId } = context;
    console.log("executing", nodeId);
    if (nodeId === selectedNodeId) {
      return { next: { from: nodeId } };
    }
    return {};
  };
  return dispatchAgent;
};

const dispatchGraph = {
  nodes: {
    select1: {
      agentId: "dispatcher",
      outputs: {
        next: "ghost",
      },
    },
    select2: {
      agentId: "dispatcher",
      outputs: {
        next: "ghost",
      },
    },
    ghost: {
      source: true,
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
  const result = await graphDataTestRunner(__filename, dispatchGraph, { dispatcher: dispatchAgent, mergeNodeIdAgent });
  assert.deepStrictEqual(result, {
    ghost: { from: "select1" },
    node: { node: "hello" },
    merge: { merge: "hello", node: "hello", from: "select1" },
    result: { result: "hello", merge: "hello", node: "hello", from: "select1" },
  });
});

test("test select 2", async () => {
  const dispatchAgent = dispatchAgentGenerator("select2");
  const result = await graphDataTestRunner(__filename, dispatchGraph, { dispatcher: dispatchAgent, mergeNodeIdAgent });
  assert.deepStrictEqual(result, {
    ghost: { from: "select2" },
    node: { node: "hello" },
    merge: { merge: "hello", node: "hello", from: "select2" },
    result: { result: "hello", merge: "hello", node: "hello", from: "select2" },
  });
});

const dispatchGraph2 = {
  nodes: {
    select: {
      agentId: "dispatcher",
      outputs: {
        next1: "ghost1",
        next2: "ghost2",
        next3: "ghost3",
      },
    },
    ghost1: {
      source: true,
    },
    ghost2: {
      source: true,
    },
    ghost3: {
      source: true,
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
  const dispatchAgent: AgentFunction<{ delay: number; fail: boolean }, Record<string, any>, Record<string, any>> = async (context) => {
    const { nodeId } = context;
    console.log("executing", nodeId);
    return selectedKeys.reduce((tmp: Record<string, any>, current) => {
      tmp[current] = { from: nodeId };
      return tmp;
    }, {});
  };
  return dispatchAgent;
};

test("test next 1", async () => {
  const dispatchAgent = dispatchAgentGenerator2(["next1"]);
  const result = await graphDataTestRunner(__filename, dispatchGraph2, { dispatcher: dispatchAgent, mergeNodeIdAgent });
  console.log(result);
  assert.deepStrictEqual(result, {
    ghost1: { from: "select" },
    result1: { result1: "hello", from: "select" },
  });
});

test("test next 3", async () => {
  const dispatchAgent = dispatchAgentGenerator2(["next3"]);
  const result = await graphDataTestRunner(__filename, dispatchGraph2, { dispatcher: dispatchAgent, mergeNodeIdAgent });
  assert.deepStrictEqual(result, {
    ghost3: { from: "select" },
    result3: { result3: "hello", from: "select" },
  });
});

test("test next 2, 3", async () => {
  const dispatchAgent = dispatchAgentGenerator2(["next2", "next3"]);
  const result = await graphDataTestRunner(__filename, dispatchGraph2, { dispatcher: dispatchAgent, mergeNodeIdAgent });
  console.log(result);
  assert.deepStrictEqual(result, {
    ghost2: { from: "select" },
    ghost3: { from: "select" },
    result2: { result2: "hello", from: "select" },
    result3: { result3: "hello", from: "select" },
  });
});
