import Anthropic from '@anthropic-ai/sdk';
import { AgentFunction } from "@/index";
import { sleep } from "@/utils/utils";

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
> = async ({ params, inputs }) => {
  const { query, system, temperature, max_tokens } = params;
  const [input_query, previous_messages] = inputs;

  // Notice that we ignore params.system if previous_message exists.
  const messages: Array<any> = previous_messages && Array.isArray(previous_messages) ? previous_messages : system ? [{ role: "system", content: system }] : [];

  const content = (query ? [query] : []).concat(input_query ? [input_query as string] : []).join("\n");
  if (content) {
    messages.push({
      role: "user",
      content,
    });
  }

  const anthropic = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
  });

  return await anthropic.messages.create({
    model: params.model || "claude-3-opus-20240229",
    messages,
    temperature: temperature ?? 0.7,
    max_tokens: max_tokens ?? 1024,
    // tools: params.tools,
    // tool_choice: params.tool_choice,
  });
};

const anthropicAgentInfo = {
  name: "anthropicAgent",
  agent: anthropicAgent,
  mock: anthropicAgent,
  samples: [
    {
    },
  ],
  skipTest: true,
  description: "Anthropic Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default anthropicAgentInfo;
