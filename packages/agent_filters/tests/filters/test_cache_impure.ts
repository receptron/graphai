import { AgentFunction, defaultTestContext } from "graphai";

import { agentFilterRunnerBuilder, cacheAgentFilterGenerator } from "@/index";

import test from "node:test";
import assert from "node:assert";

// impureAgent cache example.
const fileSampleAgent: AgentFunction = async ({ namedInputs, filterParams }) => {
  // cache process.
  const { message } = namedInputs;
  const fileKey = message;

  if (filterParams.cache) {
    const cacheData = await filterParams.cache.getCache(fileKey);
    if (cacheData) {
      return cacheData;
    }
  }

  // agent process.
  const result = fileKey;

  // after cache process
  if (filterParams.cache) {
    await filterParams.cache.setCache(fileKey, result);
  }
  return result;
};

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

test("test cache impureAgent cache hit", async () => {
  const cacheAgentFilter = cacheAgentFilterGenerator({ getCache, setCache });
  const agentFilters = [
    {
      name: "cacheAgentFilter",
      agent: cacheAgentFilter,
    },
  ];
  const agentFilterRunner = agentFilterRunnerBuilder(agentFilters);
  const result = await agentFilterRunner(
    { ...defaultTestContext, inputs: [], namedInputs: { message: "123" }, params: {}, cacheType: "impureAgent" },
    fileSampleAgent,
  );
  // console.log(JSON.stringify(result));
  console.log(result);
  assert.deepStrictEqual(result, "123");
});

test("test cache impureAgent cache not hit", async () => {
  const cacheAgentFilter = cacheAgentFilterGenerator({ getCache, setCache });
  const agentFilters = [
    {
      name: "cacheAgentFilter",
      agent: cacheAgentFilter,
    },
  ];
  const agentFilterRunner = agentFilterRunnerBuilder(agentFilters);
  const result = await agentFilterRunner(
    { ...defaultTestContext, inputs: [], namedInputs: { message: "abc" }, params: {}, cacheType: "impureAgent" },
    fileSampleAgent,
  );
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, "abc");
});
