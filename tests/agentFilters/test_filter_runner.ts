import { GraphAI } from "@/graphai";
import { AgentFilterFunction, AgentFunctionContext, AgentFunction, AgentFilterInfo, ResultData } from "@/type";

import { defaultTestAgents } from "@/utils/test_agents";
import { defaultTestContext } from "@/utils/test_utils";

import test from "node:test";
import assert from "node:assert";

const simpleAgentFilter1: AgentFilterFunction = async (context, next) => {
  if (!context.filterParams["httpHeaders"]) {
    context.filterParams["httpHeaders"] = {};
  }
  context.filterParams["httpHeaders"]["Authorization"] = "Bearer xxxxxx";
  return next(context);
};
const simpleAgentFilter2: AgentFilterFunction = async (context, next) => {
  if (!context.filterParams["httpHeaders"]) {
    context.filterParams["httpHeaders"] = {};
  }
  context.filterParams["httpHeaders"]["Content-Type"] = "application/json";
  return next(context);
};

export const echoAgent: AgentFunction = async ({ filterParams }) => {
  console.log(filterParams);
  return filterParams;
};

const agentFilterRunner = (__agentFilters: AgentFilterInfo[]) => {
  const agentFilters = __agentFilters;
  const agentFilterHandler = (context: AgentFunctionContext, agent: AgentFunction) => {
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
  return agentFilterHandler;
};

test("test agent filter", async () => {
  const agentFilters = [
    {
      name: "simpleAgentFilter1",
      agent: simpleAgentFilter1,
    },
    {
      name: "simpleAgentFilter2",
      agent: simpleAgentFilter2,
    },
  ];
  const agentFilterHandler = agentFilterRunner(agentFilters);
  const result = await agentFilterHandler({ ...defaultTestContext, inputs: [] }, echoAgent);
  console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { httpHeaders: { Authorization: "Bearer xxxxxx", "Content-Type": "application/json" } });
});
