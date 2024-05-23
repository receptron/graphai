import { AgentFunction } from "@/index";
import { Groq } from "groq-sdk";
import { ChatCompletionCreateParams, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming } from "groq-sdk/resources/chat/completions";

import { assert } from "@/utils/utils";

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : undefined;

//
// This agent takes two optional inputs, and following parameters.
// inputs:
// - [0]: query string (typically from the user), optional
// - [1]: array of messages from previous conversation, optional
//
// params:
// - model: LLM model (Llama3-8b-8192, Llama3-70b-8192, Mixtral-8x7b-32768), required.
// - query: Additional query string from the app to prepend the query from the user, optional.
// - system: System prompt (ignored if inputs[1] is specified), optional
// - tools: Function definitions, optional
// - tool_choice: Tool choice parameter, optional (default = "auto")
// - temperature: Controls randomness of responses, optional (default = 0.7)
// - max_tokens: The maximum number of tokens that the model can process in a single response, optional.
// - verbose: dumps the message array to the debug console, before sending it the LLM.
//
// https://console.groq.com/docs/quickstart
//
export const groqAgent: AgentFunction<
  {
    model: string;
    query?: string;
    system?: string;
    verbose?: boolean;
    tools?: Groq.Chat.CompletionCreateParams.Tool[];
    temperature?: number;
    max_tokens?: number;
    tool_choice?: Groq.Chat.CompletionCreateParams.ToolChoice;
    stream?: boolean;
  },
  // Groq.Chat.ChatCompletion,
  any,
  string | Array<Groq.Chat.CompletionCreateParams.Message>
> = async ({ params, inputs, filterParams }) => {
  assert(groq !== undefined, "The GROQ_API_KEY environment variable is missing.");
  const { verbose, query, system, tools, tool_choice, max_tokens, temperature, stream } = params;
  const [input_query, previous_messages] = inputs;

  // Notice that we ignore params.system if previous_message exists.
  const messagesProvided: Array<Groq.Chat.CompletionCreateParams.Message> =
    previous_messages && Array.isArray(previous_messages) ? previous_messages : system ? [{ role: "system", content: system }] : [];
  const messages = messagesProvided.map(m => m); // sharrow copy

  const content = (query ? [query] : []).concat(input_query && typeof input_query === "string" ? [input_query] : []).join("\n");
  if (content) {
    messages.push({
      role: "user",
      content,
    });
  }

  if (verbose) {
    console.log(messages);
  }
  const streamOption: ChatCompletionCreateParamsStreaming = {
    messages,
    model: params.model,
    temperature: temperature ?? 0.7,
    stream: true,
  };
  const nonStreamOption: ChatCompletionCreateParamsNonStreaming = {
    messages,
    model: params.model,
    temperature: temperature ?? 0.7,
  };

  const options: ChatCompletionCreateParams = stream ? streamOption : nonStreamOption;
  if (max_tokens) {
    options.max_tokens = max_tokens;
  }
  if (tools) {
    options.tools = tools;
    options.tool_choice = tool_choice ?? ("auto" as Groq.Chat.CompletionCreateParams.ToolChoice);
  }
  if (!options.stream) {
    const result = await groq.chat.completions.create(options);
    return result;
  }
  // streaming
  const pipe = await groq.chat.completions.create(options);
  let lastMessage = null;
  const contents = [];
  for await (const message of pipe) {
    const token = message.choices[0].delta.content;
    if (token) {
      if (filterParams && filterParams.streamTokenCallback) {
        filterParams.streamTokenCallback(token);
      }
      contents.push(token);
    }
    lastMessage = message as any;
  }
  if (lastMessage) {
    lastMessage.choices[0]["message"] = [{ role: "assistant", content: contents.join("") }];
  }
  return lastMessage;
};

const groqAgentInfo = {
  name: "groqAgent",
  agent: groqAgent,
  mock: groqAgent,
  samples: [],
  description: "Groq Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",

  stream: true,
  npms: ["groq-sdk"],
};

export default groqAgentInfo;
