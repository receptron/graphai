import { AgentFunction } from "@/graphai";
import { Groq } from "groq-sdk";
import { assert } from "@/utils/utils";

const groq = process.env.GROQ_API_KEY
  ? new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  : undefined;

export const gloqAgent: AgentFunction<
  {
    model: string;
    query?: string;
    system?: string;
  },
  Record<string, any> | string,
  string
> = async ({ params, inputs }) => {
  assert(groq !== undefined, "The GROQ_API_KEY environment variable is missing.");
  const query = params?.query ? [params.query] : [];
  const content = query.concat(inputs).join("\n");
  const messages = params?.system ? [{ role: "system", content: params.system }] : [];
  messages.push({
    role: "user",
    content,
  });
  console.log(messages);
  const result = await groq.chat.completions.create({
    messages,
    model: params.model,
  });
  return result;
};

const gloqAgentInfo = {
  name: "gloqAgent",
  agent: gloqAgent,
  mock: gloqAgent,
  samples: [],
  description: "Groq Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default gloqAgentInfo;
