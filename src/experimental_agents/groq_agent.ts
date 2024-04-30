import { AgentFunction } from "@/graphai";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const gloqAgent: AgentFunction<
  {
    model: string;
    prompt: string;
  },
  Record<string, any> | string,
  string
> = async ({ params }) => {
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
