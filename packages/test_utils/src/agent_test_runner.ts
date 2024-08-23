import { AgentFunctionInfo, defaultTestContext } from "graphai";

import test from "node:test";
import assert from "node:assert";

// for agent
export const agentTestRunner = async (agentInfo: AgentFunctionInfo) => {
  const { agent, samples, inputs: inputSchema } = agentInfo;
  if (samples.length === 0) {
    console.log(`test ${agentInfo.name}: No test`);
  } else {
    for await (const sampleKey of samples.keys()) {
      test(`test ${agentInfo.name} ${sampleKey}`, async () => {
        const { params, inputs, result, graph } = samples[sampleKey];
        const flatInputs = Array.isArray(inputs) ? inputs : [];
        const namedInputs = Array.isArray(inputs) ? {} : inputs;

        const actual = await agent({
          ...defaultTestContext,
          params,
          inputs: flatInputs,
          inputSchema,
          namedInputs,
          graphData: graph,
        });
        assert.deepStrictEqual(actual, result);
      });
    }
  }
};
