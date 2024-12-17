import path from "path";
import { getPackageJson, getAgents } from "@/agentdoc";
import * as agents from "@graphai/agents"

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
