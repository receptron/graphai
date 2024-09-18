import { popAgent } from "@/index";
import { defaultTestContext } from "graphai";

import test from "node:test";
import assert from "node:assert";

test("test pop_agent error", async () => {
  await assert.rejects(
    async () => {
      await popAgent.agent({
        ...defaultTestContext,
        inputs: [],
        params: {},
        namedInputs: {},
      });
    },
    {
      message: 'popAgent: namedInputs.array is UNDEFINED!',
      name: 'Error',
    },
  );

  await assert.rejects(
    async () => {
      await popAgent.agent({
        ...defaultTestContext,
        inputs: [1, 2, 3],
        params: {},
        namedInputs: {},
      });
    },
    {
      message: 'popAgent: namedInputs.array is UNDEFINED!',
      name: 'Error',
    },
  );
});
