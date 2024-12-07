import * as packages from "@/index";
import { defaultTestContext } from "graphai";

import test from "node:test";
import assert from "node:assert";

test("test shell_command_agent basic echo", async () => {
  const result = await packages.shellCommandAgent.agent({
    ...defaultTestContext,
    namedInputs: {},
    params: {
      command: 'echo "Hello World!"',
    },
  });

  assert.strictEqual(result.stdout.trim(), "Hello World!");
});

test("test shell_command_agent with invalid command", async () => {
  try {
    await packages.shellCommandAgent.agent({
      ...defaultTestContext,
      namedInputs: {},
      params: {
        command: "invalid_command_123",
      },
    });
    assert.fail("Expected error was not thrown");
  } catch (error) {
    assert.ok(error instanceof Error);
  }
});
