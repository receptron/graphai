import Anthropic from "@anthropic-ai/sdk";
import { AgentFunction, AgentFunctionInfo } from "graphai";

export const anthropicAgent: AgentFunction<
  {
    model?: string;
    system?: string;
    temperature?: number;
    max_tokens?: number;
    // tools?: any;
    // tool_choice?: any;
    prompt?: string;
    messages?: Array<Record<string, any>>;
  },
  Record<string, any> | string,
  string | Array<any>
> = async ({ params, namedInputs }) => {
  const { model, system, temperature, max_tokens, prompt, messages } = { ...params, ...namedInputs };

  // Notice that we ignore params.system if previous_message exists.
  const messagesCopy: Array<any> = messages ? messages.map((m) => m) : system ? [{ role: "system", content: system }] : [];

  if (prompt) {
    messagesCopy.push({
      role: "user",
      content: Array.isArray(prompt) ? prompt.join("\n") : prompt,
    });
  }

  const anthropic = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"], // This is the default and can be omitted
  });

  const message = await anthropic.messages.create({
    model: model || "claude-3-haiku-20240307", // "claude-3-opus-20240229",
    messages: messagesCopy,
    temperature: temperature ?? 0.7,
    max_tokens: max_tokens ?? 1024,
    // tools: params.tools,
    // tool_choice: params.tool_choice,
  });

  return { choices: [{ message: { role: message.role, content: message.content[0].text } }] };
};

const anthropicAgentInfo: AgentFunctionInfo = {
  name: "anthropicAgent",
  agent: anthropicAgent,
  mock: anthropicAgent,
  inputs: {
    type: "object",
    properties: {
      model: { type: "string" },
      system: { type: "string" },
      max_tokens: { type: "number" },
      temperature: { type: "number" },
      prompt: {
        type: "string",
        description: "query string",
      },
      messages: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
        description: "chat messages",
      },
    },
  },
  output: {
    type: "object",
  },
  samples: [],
  description: "Anthropic Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
  // stream: true,
  npms: ["@anthropic-ai/sdk"],
};

export default anthropicAgentInfo;
