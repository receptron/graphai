import path from "path";
import { getPackageJson, getAgents, getGitRep } from "@/agentdoc";
// import * as agents from "@graphai/agents"

import test from "node:test";
import assert from "node:assert";

test("test getAgents", async () => {
  const actual =  getAgents(["AAgent", "BAgent"]);
  const expect = "AAgent, BAgent";
  assert.equal(expect, actual);
});

test("test getPackageJson", async () => {
  const actual = getPackageJson(path.resolve(__dirname, "../../../llm_agents/openai_agent"));
  const expect = 'OpenAI agents for GraphAI.';
  assert.equal(expect, actual?.description);
});


test("test getGitRep", async () => {
  const packageJson = getPackageJson(path.resolve(__dirname, "../../../llm_agents/openai_agent"));
  if (packageJson && packageJson.repository) {
    const url = getGitRep(packageJson.repository);
    console.log(url);
  };
  // assert.equal(expect, actual?.description);
});

test("test getGitRep", async () => {
  const url = getGitRep("git+https://github.com/user/package");
  assert.equal(url, "user/package");
});

test("test getGitRep", async () => {
  const url = getGitRep("https://github.com/user/package");
  assert.equal(url, "user/package");
});

test("test getGitRep", async () => {
  const url = getGitRep("git+ssh://github.com/user/package");
  assert.equal(url, "user/package");
});

