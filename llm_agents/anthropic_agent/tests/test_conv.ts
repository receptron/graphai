import { anthoropicTool2OpenAITool } from "../src/utils";
import test from "node:test";
import assert from "node:assert";

test("can convert a single text block", () => {
  const response = {
    role: "assistant",
    content: [{ type: "text", text: "Hello" }],
  };
  const result = anthoropicTool2OpenAITool(response as any);

  assert.deepStrictEqual(result, {
    role: "assistant",
    content: "Hello",
  });
});

test("expands tool_calls when tool_use is included", () => {
  const response = {
    role: "assistant",
    content: [
      { type: "text", text: "Running tool..." },
      { type: "tool_use", id: "tool1", name: "get_weather", input: { city: "Tokyo" } },
    ],
  };
  const result = anthoropicTool2OpenAITool(response as any);

  assert.deepStrictEqual(result, {
    role: "assistant",
    content: "Running tool...",
    tool_calls: [{ id: "tool1", function: { name: "get_weather", arguments: '{"city":"Tokyo"}' }, type: "function" }],
  });
});

test("eturns only text when no tool_use is mixed in", () => {
  const response = {
    role: "assistant",
    content: [
      { type: "text", text: "Just a message" },
      { type: "text", text: "ignored" },
    ],
  };
  const result = anthoropicTool2OpenAITool(response as any);

  assert.deepStrictEqual(result, {
    role: "assistant",
    content: "Just a message ignored",
  });
});
