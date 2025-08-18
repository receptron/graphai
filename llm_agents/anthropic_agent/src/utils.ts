import Anthropic from "@anthropic-ai/sdk";

import type { GraphAIToolPayload } from "@graphai/agent_utils";

export type Response = Anthropic.Message & { _request_id?: string | null | undefined };
type TOOLS_CONTENT = { type: string; text?: string; id?: string; name?: string; input?: unknown };

export const anthoropicToolCall2OpenAIToolCall = (toolCall: Anthropic.Messages.ToolUseBlock): GraphAIToolPayload => {
  const { id, name, input } = toolCall;
  return {
    id,
    type: "function",
    function: {
      name,
      arguments: (() => {
        try {
          return JSON.stringify(input ?? {});
        } catch (__e) {
          return "{}";
        }
      })(),
    },
  };
};


export const openAIToolCall2AnthropicToolCall = (tool: { id: string; function: { name: string; arguments: string } }) => {
  const { id, function: func } = tool;
  const { name, arguments: args } = func ?? {};

  return {
    type: "tool_use",
    id,
    name,
    input: (() => {
      try {
        return JSON.parse(args ?? "{}");
      } catch (__e) {
        return {};
      }
    })(),
  };
};

export const anthoropicTool2OpenAITool = (response: Response) => {
  const contentText = response.content
    .filter((c): c is Anthropic.TextBlock => c.type === "text")
    .map((b) => b.text ?? "")
    .join(" ");

  const tool_calls = response.content.filter((c): c is Anthropic.Messages.ToolUseBlock => c.type === "tool_use").map(anthoropicToolCall2OpenAIToolCall);
  if (tool_calls.length > 0) {
    return {
      role: response.role,
      content: contentText,
      tool_calls,
    };
  }
  return { role: response.role, content: contentText };
};

export const convOpenAIToolsToAnthropicToolMessage = (messages: any[]) => {
  return messages.reduce((tmp: any[], message: any) => {
    if (message.role === "assistant" && message.tool_calls) {
      const content: TOOLS_CONTENT[] = [
        {
          type: "text",
          text: message.content || "run tools",
        },
      ];
      message.tool_calls.map(openAIToolCall2AnthropicToolCall).forEach((data: TOOLS_CONTENT) => {
        content.push(data);
      });
      tmp.push({
        role: "assistant",
        content,
      });
    } else if (message.role === "tool") {
      const last = tmp[tmp.length - 1];
      if (last?.role === "user" && last?.content?.[0]?.type === "tool_result") {
        tmp[tmp.length - 1].content.push({
          type: "tool_result",
          tool_use_id: message.tool_call_id,
          content: message.content,
        });
      } else {
        tmp.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: message.tool_call_id,
              content: message.content,
            },
          ],
        });
      }
    } else {
      tmp.push(message);
    }
    return tmp;
  }, []);
};

