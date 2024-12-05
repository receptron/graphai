import { defaultTestContext } from "graphai";
import { echoAgent } from "@graphai/vanilla";

import { agentFilterRunnerBuilder, cacheAgentFilterGenerator } from "@/index";

import test from "node:test";
import assert from "node:assert";

const setCache = async (key: string, data: any) => {
  assert.equal(key, "Z41LG2CuJPBVJeMA6AlwMVCjWaUR2wmP02ZaBxn+evA=");
  assert.deepStrictEqual(data, { test: "123" });
  return;
};
const getCache = async (key: string) => {
  if (key === "7Kt65Cn3am8B/qWZdUQbzhr3VyEX/9bQRyBjZNaWXdo=") {
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
    { ...defaultTestContext, namedInputs: { message: "123" }, params: {}, cacheType: "pureAgent" },
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
    { ...defaultTestContext, namedInputs: { message: "abc" }, params: { test: "123" }, cacheType: "pureAgent" },
    echoAgent.agent,
  );
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { test: "123" });
});
