import { AgentFunction } from "@/graphai";
import { graphDataTestRunner } from "~/utils/runner";
import { mergeNodeIdAgent } from "~/agents/agents";

import test from "node:test";
import assert from "node:assert";

const dispatchAgentGenerator = (selectedNodeId: string) => {
  const dispatchAgent: AgentFunction<{ delay: number; fail: boolean }, Record<string, any>, Record<string, any>> = async (context) => {
    const { nodeId, retry, params, inputs } = context;
    console.log("executing", nodeId);
    if (nodeId === selectedNodeId) {
      return { next: {"from": nodeId} };
    }
    return {};
  };
  return dispatchAgent;
};

const forkGraph = {
  nodes: {
    select1: {
      agentId: "dispatcher",
        outputs: {
          next: "ghost"
        }
    },
    select2: {
      agentId: "dispatcher",
      outputs: {
        next: "ghost"
      }
    },
    ghost: {
      source: true
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
  const result = await graphDataTestRunner(__filename, forkGraph, {dispatcher: dispatchAgent, mergeNodeIdAgent});
  assert.deepStrictEqual(result, {
    ghost: { from: 'select1' },
    node: { node: 'hello' },
    merge: { merge: 'hello', node: 'hello', from: 'select1' },
    result: { result: 'hello', merge: 'hello', node: 'hello', from: 'select1' }
  });
  
});

test("test select 2", async () => {

  const dispatchAgent = dispatchAgentGenerator("select2");
  const result = await graphDataTestRunner(__filename, forkGraph, {dispatcher: dispatchAgent, mergeNodeIdAgent});
  assert.deepStrictEqual(result, {
    ghost: { from: 'select2' },
    node: { node: 'hello' },
    merge: { merge: 'hello', node: 'hello', from: 'select2' },
    result: { result: 'hello', merge: 'hello', node: 'hello', from: 'select2' }
  });
});

