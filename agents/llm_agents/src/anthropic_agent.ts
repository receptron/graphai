import Anthropic from "@anthropic-ai/sdk";
import { AgentFunction } from "graphai";

export const anthropicAgent: AgentFunction<
  {
    model?: string;
    query?: string;
    system?: string;
    temperature?: number;
    max_tokens?: number;
    // tools?: any;
    // tool_choice?: any;
  },
  Record<string, any> | string,
  string | Array<any>
> = async ({ params, namedInputs }) => {
  const { system, temperature, max_tokens } = params;
  const input_query = namedInputs.prompt;
  const previous_messages = namedInputs.messages;

  // Notice that we ignore params.system if previous_message exists.
  const messagesProvided: Array<any> =
    previous_messages && Array.isArray(previous_messages) ? previous_messages : system ? [{ role: "system", content: system }] : [];
  const messages = messagesProvided.map((m) => m); // sharrow copy

  const content = (input_query ? [input_query as string] : []).join("\n");
  if (content) {
    messages.push({
      role: "user",
      content,
    });
  }

  const anthropic = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"], // This is the default and can be omitted
  });

  const message = await anthropic.messages.create({
    model: params.model || "claude-3-haiku-20240307", // "claude-3-opus-20240229",
    messages,
    temperature: temperature ?? 0.7,
    max_tokens: max_tokens ?? 1024,
    // tools: params.tools,
    // tool_choice: params.tool_choice,
  });

  return { choices: [{ message: { role: message.role, content: message.content[0].text } }] };
};

const anthropicAgentInfo = {
  name: "anthropicAgent",
  agent: anthropicAgent,
  mock: anthropicAgent,
  inputs: {
    type: "object",
    properties: {
      prompt: {
        type: "string",
        description: "query string",
      },
      messages: {
        type: "any",
        description: "chat messages",
      },
    },
  },
  output: {
    type: "object",
  },
  samples: [],
  skipTest: true,
  description: "Anthropic Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
  // stream: true,
  npms: ["@anthropic-ai/sdk"],
};

export default anthropicAgentInfo;
