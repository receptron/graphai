import "dotenv/config";
import { AgentFunction } from "@/graphai";
import { Groq } from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const gloqAgent: AgentFunction<
  {
    model: string;
  },
  Record<string, any> | string,
  string
> = async ({ params, inputs }) => {
  console.log("***");
　const result = await groq.chat.completions.create({
    messages: [
        {
            role: "user",
            content: "Explain the importance of fast language models"
        }
    ],
    model: "mixtral-8x7b-32768"
  });
  console.log("***", result);
  return result;
};
