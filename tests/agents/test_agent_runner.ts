import dataSumTemplateAgentInfo from "@/experimental_agents/data_agents/data_sum_template_agent";
import totalAgentInfo from "@/experimental_agents/data_agents/total_agent";

import { defaultTestContext } from "~/agents/utils";

import test from "node:test";
import assert from "node:assert";

import { AgentFunctionInfo } from "@/type";

const agentTest = async (agentInfo: AgentFunctionInfo) => {
  test(`test ${agentInfo.name}`, async () => {
    const { agent, samples } = agentInfo;
    for await (const sample of samples) {
      const { params, inputs, result } = sample;

      const actual = await agent({
        ...defaultTestContext,
        params,
        inputs,
      });
      assert.deepStrictEqual(result, actual);
    }
  });
};

[dataSumTemplateAgentInfo, totalAgentInfo].map((agentInfo) => {
  agentTest(agentInfo);
});
