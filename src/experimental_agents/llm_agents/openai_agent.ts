import OpenAI from "openai";
import { AgentFunction } from "@/index";
import { sleep } from "@/utils/utils";

export const openAIAgent: AgentFunction<
  {
    model?: string;
    query?: string;
    system?: string;
    tools?: any;
    tool_choice?: any;
    verbose?: boolean;
    temperature?: number;
    baseURL?: string;
    apiKey?: string;
    stream?: boolean;
  },
  Record<string, any> | string,
  string | Array<any>
> = async ({ filterParams, params, inputs }) => {
  const { verbose, query, system, temperature, baseURL, apiKey, stream } = params;
  const [input_query, previous_messages] = inputs;

  // Notice that we ignore params.system if previous_message exists.
  const messagesProvided: Array<any> =
    previous_messages && Array.isArray(previous_messages) ? previous_messages : system ? [{ role: "system", content: system }] : [];
  const messages = messagesProvided.map((m) => m); // sharrow copy

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

  const openai = apiKey && baseURL ? new OpenAI({ apiKey, baseURL }) : new OpenAI();

  if (!stream) {
    return await openai.chat.completions.create({
      model: params.model || "gpt-3.5-turbo",
      messages,
      tools: params.tools,
      tool_choice: params.tool_choice,
      temperature: temperature ?? 0.7,
    });
  }
  const chatStream = await openai.beta.chat.completions.stream({
    model: params.model || "gpt-3.5-turbo",
    messages,
    tools: params.tools,
    tool_choice: params.tool_choice,
    temperature: temperature ?? 0.7,
    stream: true,
  });

  for await (const message of chatStream) {
    const token = message.choices[0].delta.content;
    if (filterParams && filterParams.streamTokenCallback && token) {
      filterParams.streamTokenCallback(token);
    }
  }

  const chatCompletion = await chatStream.finalChatCompletion();
  return chatCompletion;
};

const input_sample = "this is response result";
const result_sample = {
  object: "chat.completion",
  id: "chatcmpl-9N7HxXYbwjmdbdiQE94MHoVluQhyt",
  choices: [
    {
      message: {
        role: "assistant",
        content: input_sample,
      },
      finish_reason: "stop",
      index: 0,
      logprobs: null,
    },
  ],
  created: 1715296589,
  model: "gpt-3.5-turbo-0125",
};

export const openAIMockAgent: AgentFunction<
  {
    model?: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    temperature?: number;
  },
  Record<string, any> | string,
  string | Array<any>
> = async ({ filterParams }) => {
  for await (const token of input_sample.split("")) {
    if (filterParams && filterParams.streamTokenCallback && token) {
      await sleep(100);
      filterParams.streamTokenCallback(token);
    }
  }

  return result_sample;
};
const openaiAgentInfo = {
  name: "openAIAgent",
  agent: openAIAgent,
  mock: openAIMockAgent,
  samples: [
    {
      inputs: [input_sample],
      params: {},
      result: result_sample,
    },
  ],
  skipTest: true,
  description: "Openai Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
  stream: true,
  npms: ["openai"],
};

export default openaiAgentInfo;
