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
    prompt: string;
  },
  Record<string, any> | string,
  string
> = async ({ params }) => {
  assert(groq !== undefined, "The GROQ_API_KEY environment variable is missing.");
  const result = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: params.prompt,
      },
    ],
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
  category: [],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default gloqAgentInfo;
