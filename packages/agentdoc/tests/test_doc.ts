import { getAgents } from "@/agentdoc";
import * as agents from "@graphai/agents"

import test from "node:test";
import assert from "node:assert";

test("test getAgents", async () => {
  const actual =  getAgents(["AAgent", "BAgent"]);
  const expect = "AAgent, BAgent";
  assert.equal(expect, actual);

});
