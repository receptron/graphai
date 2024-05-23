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
  filterParams: {},
  agents: {},
  log: [],
};

// for agent
export const agentTestRunner = async (agentInfo: AgentFunctionInfo) => {
  const { agent, samples, skipTest } = agentInfo;
  if (samples.length === 0) {
    console.log(`test ${agentInfo.name}: No test`);
  } else if (skipTest) {
    console.log(`test ${agentInfo.name}: skip`);
  } else {
    for await (const sampleKey of samples.keys()) {
      test(`test ${agentInfo.name} ${sampleKey}`, async () => {
        const { params, inputs, result, graph } = samples[sampleKey];

        const actual = await agent({
          ...defaultTestContext,
          params,
          inputs,
          graphData: graph,
        });
        assert.deepStrictEqual(actual, result);
      });
    }
  }
};
