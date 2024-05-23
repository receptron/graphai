import { AgentFunction } from "@/index";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
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
  const messagesProvided: Array<any> = previous_messages && Array.isArray(previous_messages) ? previous_messages : system ? [{ role: "system", content: system }] : [];
  const messages = messagesProvided.map(m => m); // sharrow copy

  const content = (query ? [query] : []).concat(input_query ? [input_query as string] : []).join("\n");
  if (content) {
    messages.push({
      role: "user",
      content,
    });
  }
  console.log(messages);
  const lastMessage = messages.pop();

  const key = process.env["GOOGLE_GENAI_API_KEY"];
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: params.model ?? "gemini-pro",
  });
  const generationConfig = {
    maxOutputTokens: max_tokens,
    temperature,
    // topP: 0.1,
    // topK: 16,
  };
  const chat = model.startChat({
    history: messages.map((message) => {
      const role = (message.role === "assistant") ? "model" : message.role;
      return { role, parts: [{ text: message.content }] };
    }),
    generationConfig,
  });

  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;
  const text = response.text();
  // choices.$0.message
  return { choices: [{ message: { role: "assistant", content: text} }] };
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
