import { AgentFunction } from "@/graphai";
import { Groq } from "groq-sdk";
import { assert } from "@/utils/utils";

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : undefined;

export const groqAgent: AgentFunction<
  {
    model: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    tools?: Record<string, any>;
    tool_choice: string | Record<string, any>;
  },
  Record<string, any> | string,
  string | Array<Record<string, any>>
> = async ({ params, inputs }) => {
  assert(groq !== undefined, "The GROQ_API_KEY environment variable is missing.");
  const { verbose, query, system, tools, tool_choice } = params;
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

  if (verbose) {
    console.log(messages);
  }
  const options: any = {
    messages,
    model: params.model,
  };
  if (tools) {
    options.tools = tools;
    options.tool_choice = tool_choice ?? "auto";
  }
  const result = await groq.chat.completions.create(options);
  return result;
};

const groqAgentInfo = {
  name: "groqAgent",
  agent: groqAgent,
  mock: groqAgent,
  samples: [],
  description: "Groq Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default groqAgentInfo;
