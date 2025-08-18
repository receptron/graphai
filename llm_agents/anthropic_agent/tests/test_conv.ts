import { anthoropicTool2OpenAITool, anthoropicToolCall2OpenAIToolCall, openAIToolCall2AnthropicToolCall } from "../src/utils";
import test from "node:test";
import assert from "node:assert";

// anthoropicTool2OpenAITool
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

// Anthropic -> OpenAI
test("converts simple tool_use to OpenAI format", () => {
  const toolCall = {
    type: "tool_use",
    id: "call_1",
    name: "get_weather",
    input: { city: "Tokyo" },
  };

  const result = anthoropicToolCall2OpenAIToolCall(toolCall as any);

  assert.deepStrictEqual(result, {
    id: "call_1",
    type: "function",
    function: {
      name: "get_weather",
      arguments: JSON.stringify({ city: "Tokyo" }),
    },
  });
});

test("handles missing input gracefully", () => {
  const toolCall = {
    type: "tool_use",
    id: "call_2",
    name: "get_time",
    input: undefined,
  };

  const result = anthoropicToolCall2OpenAIToolCall(toolCall as any);

  assert.deepStrictEqual(result, {
    id: "call_2",
    type: "function",
    function: {
      name: "get_time",
      arguments: "{}",
    },
  });
});

// OpenAI -> Anthropic
test("converts OpenAI tool_call to Anthropic format", () => {
  const openAITool = {
    id: "tool_1",
    function: {
      name: "get_weather",
      arguments: JSON.stringify({ city: "Osaka" }),
    },
  };

  const result = openAIToolCall2AnthropicToolCall(openAITool);

  assert.deepStrictEqual(result, {
    type: "tool_use",
    id: "tool_1",
    name: "get_weather",
    input: { city: "Osaka" },
  });
});

test("handles invalid JSON arguments safely", () => {
  const openAITool = {
    id: "tool_2",
    function: {
      name: "broken_tool",
      arguments: "{ invalid json }",
    },
  };

  const result = openAIToolCall2AnthropicToolCall(openAITool);

  assert.deepStrictEqual(result, {
    type: "tool_use",
    id: "tool_2",
    name: "broken_tool",
    input: {},
  });
});
