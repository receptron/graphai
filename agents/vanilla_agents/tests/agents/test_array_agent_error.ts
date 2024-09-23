import { popAgent, pushAgent } from "@/index";
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
      message: "popAgent: namedInputs is UNDEFINED!",
      name: "Error",
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
      message: "popAgent: namedInputs is UNDEFINED!",
      name: "Error",
    },
  );

  await assert.rejects(
    async () => {
      await popAgent.agent({
        ...defaultTestContext,
        inputs: [],
        params: {},
        namedInputs: { message: "123" },
      });
    },
    {
      message: "popAgent: namedInputs.array is UNDEFINED!",
      name: "Error",
    },
  );
});

test("test push_agent error", async () => {
  await assert.rejects(
    async () => {
      await pushAgent.agent({
        ...defaultTestContext,
        inputs: [],
        params: {},
        namedInputs: {},
      });
    },
    {
      message: "pushAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId, item: :itemNodeId }",
      name: "Error",
    },
  );

  await assert.rejects(
    async () => {
      await pushAgent.agent({
        ...defaultTestContext,
        inputs: [1, 2, 3],
        params: {},
        namedInputs: {},
      });
    },
    {
      message: "pushAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId, item: :itemNodeId }",
      name: "Error",
    },
  );

  await assert.rejects(
    async () => {
      await pushAgent.agent({
        ...defaultTestContext,
        inputs: [],
        params: {},
        namedInputs: { test: 123 },
      });
    },
    {
      message: "pushAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId, item: :itemNodeId }",
      name: "Error",
    },
  );

  await assert.rejects(
    async () => {
      await pushAgent.agent({
        ...defaultTestContext,
        inputs: [],
        params: {},
        namedInputs: { array: [123] },
      });
    },
    {
      message: "pushAgent: namedInputs.item is UNDEFINED! Set inputs: { array: :arrayNodeId, item: :itemNodeId }",
      name: "Error",
    },
  );

});
