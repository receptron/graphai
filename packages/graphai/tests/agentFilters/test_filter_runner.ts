import { AgentFilterFunction } from "@/type";
import * as agents from "../test_agents";

import { defaultTestContext } from "@/utils/test_utils";
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
  const result = await agentFilterRunner({ ...defaultTestContext, inputs: [], params: { filterParams: true } }, agents.echoAgent.agent);
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { httpHeaders: { Authorization: "Bearer xxxxxx", "Content-Type": "application/json" } });
});
