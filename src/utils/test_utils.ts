import { AgentFunctionInfo, AgentFunctionContext, AgentFunction, AgentFilterInfo, ResultData } from "@/type";

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

export const defaultAgentInfo = {
  name: "defaultAgentInfo",
  samples: [{
    inputs: [],
    params: {},
    result: {},
  }],
  description: "",
  category: [],
  author: "",
  repository: "",
  license: ""
};

export const getAgentInfo = (agent: AgentFunction<any, any, any>) => {
  return {
    agent,
    mock: agent,
    ...defaultAgentInfo,
  };
};

// for agent
export const agentTestRunner = async (agentInfo: AgentFunctionInfo) => {
  const { agent, samples, skipTest } = agentInfo;
  if (samples.length === 0 || skipTest) {
    console.log(`test ${agentInfo.name}: No test`);
  } else {
    for await (const sampleKey of samples.keys()) {
      test(`test ${agentInfo.name} ${sampleKey}`, async () => {
        const { params, inputs, result } = samples[sampleKey];

        const actual = await agent({
          ...defaultTestContext,
          params,
          inputs,
        });
        assert.deepStrictEqual(actual, result);
      });
    }
  }
};

// for agent and agent filter.
export const agentFilterRunnerBuilder = (__agentFilters: AgentFilterInfo[]) => {
  const agentFilters = __agentFilters;
  const agentFilterRunner = (context: AgentFunctionContext, agent: AgentFunction) => {
    let index = 0;

    const next = (context: AgentFunctionContext): Promise<ResultData> => {
      const agentFilter = agentFilters[index++];
      if (agentFilter) {
        return agentFilter.agent(context, next);
      }
      return agent(context);
    };

    return next(context);
  };
  return agentFilterRunner;
};
