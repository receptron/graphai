import { AgentFilterFunction, defaultTestContext } from "graphai";
import { echoAgent } from "@graphai/vanilla";

import { agentFilterRunnerBuilder, cacheAgentFilterGenerator } from "@/index";

import test from "node:test";
import assert from "node:assert";

const setCache = async (key: string, data: any) => {
  console.log(key, data);
  return;
};
const getCache = async (key: string) => {
  if (key === '{"namedInputs":{"message":"123"},"params":{}}') {
    return { result: "fromCache" };
  }
  return null;
};

test("test cache pureAgent cache hit", async () => {
  const cacheAgentFilter = cacheAgentFilterGenerator({ getCache, setCache });
  const agentFilters = [
    {
      name: "cacheAgentFilter",
      agent: cacheAgentFilter,
    },
  ];
  const agentFilterRunner = agentFilterRunnerBuilder(agentFilters);
  const result = await agentFilterRunner(
    { ...defaultTestContext, inputs: [], namedInputs: { message: "123" }, params: {}, cacheType: "pureAgent" },
    echoAgent.agent,
  );
  assert.deepStrictEqual(result, { result: "fromCache" });
});

test("test cache pureAgent cache not hit", async () => {
  const cacheAgentFilter = cacheAgentFilterGenerator({ getCache, setCache });
  const agentFilters = [
    {
      name: "cacheAgentFilter",
      agent: cacheAgentFilter,
    },
  ];
  const agentFilterRunner = agentFilterRunnerBuilder(agentFilters);
  const result = await agentFilterRunner(
    { ...defaultTestContext, inputs: [], namedInputs: { message: "abc" }, params: { test: "123" }, cacheType: "pureAgent" },
    echoAgent.agent,
  );
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { test: "123" });
});
