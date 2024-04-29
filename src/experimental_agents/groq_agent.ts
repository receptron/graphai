import path from "path";
import { AgentFunction } from "@/graphai";
import { ChatSession, ChatConfig, ManifestData } from "slashgpt";
import { Groq } from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
console.log(groq);

const config = new ChatConfig(path.resolve(__dirname));

export const gloqAgent: AgentFunction<
  {
    model: string;
  },
  Record<string, any> | string,
  string
> = async ({ params, inputs }) => {

  return { test: 1 };
};
