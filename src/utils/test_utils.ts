import { AgentFunctionInfo } from "@/type";

import assert from "node:assert";
import test from "node:test";

export const defaultTestContext = {
  debugInfo: {
    nodeId: "test",
    retry: 0,
    verbose: true,
  },
  params: {},
  agents: {},
  log: [],
};

// for agent
export const agentTestRunner = async (agentInfo: AgentFunctionInfo) => {
  test(`test ${agentInfo.name}`, async () => {
    const { agent, samples } = agentInfo;
    for await (const sample of samples) {
      const { params, inputs, result } = sample;

      const actual = await agent({
        ...defaultTestContext,
        params,
        inputs,
      });
      assert.deepStrictEqual(actual, result);
    }
  });
};
