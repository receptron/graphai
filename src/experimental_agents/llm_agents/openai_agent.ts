import OpenAI from "openai";
import { AgentFunction } from "@/graphai";

export const streamopenAIAgent: AgentFunction<
  {
    model?: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    temperature?: number;
  },
  Record<string, any> | string,
  string | Array<any>
> = async ({ filterParams, params, inputs }) => {
  const { verbose, query, system, temperature } = params;
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

  const openai = new OpenAI();

  const chatStream = await openai.beta.chat.completions.stream({
    model: params.model || "gpt-3.5-turbo",
    messages,
    temperature: temperature ?? 0.7,
    stream: true,
  });

  for await (const message of chatStream) {
    const token = message.choices[0].delta.content;
    if (filterParams && filterParams.streamCallback && token) {
      filterParams.streamCallback(token);
    }
  }

  const chatCompletion = await chatStream.finalChatCompletion();
  return chatCompletion;
};
/*
export const openAIAgent: AgentFunction  = async ({ params, inputs, filterParams}) => {
  const generator = streamopenAIAgent()
  let result = await generator.next();
  while (!result.done) {
    const value = await result.value;
    if (filterParams.streamCallback) {
      filterParams.streamCallback(value);
    }
    result = await generator.next();
  }
  return result.value;
  // console.log(JSON.stringify(result.value));
  // return 123;
};
*/
