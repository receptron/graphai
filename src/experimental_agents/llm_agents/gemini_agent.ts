import { AgentFunction } from "@/index";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { assert } from "@/utils/utils";

export const geminiAgent: AgentFunction<
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

  const key = process.env["GOOGLE_GENAI_API_KEY"];
  assert(!!key, "GOOGLE_GENAI_API_KEY is missing in the environment.");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ 
    model: params.model ?? "gemini-pro"
  });
  const generationConfig = {
    maxOutputTokens: max_tokens,
    temperature,
    // topP: 0.1,
    // topK: 16,
  };
  const chat = model.startChat({
    history: [
    ],
    generationConfig,
  });  

  const result = await chat.sendMessage(content);
  const response = await result.response;
  const text = response.text();
  return text;
};

const geminiAgentInfo = {
  name: "geminiAgent",
  agent: geminiAgent,
  mock: geminiAgent,
  samples: [],
  skipTest: true,
  description: "Gemini Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
  // stream: true,
  npms: ["@anthropic-ai/sdk"],
};

export default geminiAgentInfo;
