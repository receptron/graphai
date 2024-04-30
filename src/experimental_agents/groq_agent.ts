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
    query: string;
  },
  Record<string, any> | string,
  string
> = async ({ params, inputs }) => {
  assert(groq !== undefined, "The GROQ_API_KEY environment variable is missing.");
  const query = params?.query ? [params.query] : [];
  const content = query.concat(inputs).join("\n");
  const result = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content,
      },
    ],
    model: params.model,
  });
  return result;
};
