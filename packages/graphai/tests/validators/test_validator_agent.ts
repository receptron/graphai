import { anonymization } from "@receptron/test_utils";
import { validateAgent } from "@/validator";
import { ValidationError } from "@/validators/common";

import test from "node:test";
import assert from "node:assert";

test("test agent validation", async () => {
  await assert.rejects(
    async () => {
      validateAgent(anonymization({ testAgent: null }));
    },
    { name: "Error", message: new ValidationError("No Agent: testAgent is not in AgentFunctionInfoDictionary.").message },
  );

  await assert.rejects(
    async () => {
      validateAgent(anonymization({ testAgent: "test" }));
    },
    { name: "Error", message: new ValidationError("No Agent: testAgent is not in AgentFunctionInfoDictionary.").message },
  );

  await assert.rejects(
    async () => {
      validateAgent(anonymization({ testAgent: { agent: null } }));
    },
    { name: "Error", message: new ValidationError("No Agent: testAgent is not in AgentFunctionInfoDictionary.").message },
  );

  // not rejectes
  validateAgent(anonymization({ testAgent: { agent: "aaa" } }));
});
