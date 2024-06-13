import { AgentFilterFunction, defaultTestContext } from "graphai";
import { echoAgent } from "@graphai/vanilla";

import { agentFilterRunnerBuilder } from "@/index";

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
  const agentFilterRunner = agentFilterRunnerBuilder(agentFilters);
  const result = await agentFilterRunner({ ...defaultTestContext, inputs: [], namedInputs: {}, params: { filterParams: true } }, echoAgent.agent);
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { httpHeaders: { Authorization: "Bearer xxxxxx", "Content-Type": "application/json" } });
});
