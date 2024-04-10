import path from "path";
import { AgentFunction } from "@/graphai";
import { ChatSession, ChatConfig, ManifestData } from "slashgpt";

const config = new ChatConfig(path.resolve(__dirname));

export const slashGPTFuncitons2TextAgent: AgentFunction<
  { function_data_key: string; result_key: number },
  string,
  { function_data: { [key: string]: string[] } }
> = async (context) => {
  const { params } = context;
  const result = (context?.inputs[0].function_data[params.function_data_key] || []).map((r: any) => {
    const { title, description } = r;
    return ["title:", title, "description:", description].join("\n");
  });
  return result[params.result_key];
};

export const slashGPTAgent: AgentFunction<
  { manifest: ManifestData; prompt: string; function_result?: boolean, debug?: boolean },
  { answer: string },
  string
> = async (context) => {
  const { params } = context;
  if (params.debug) {
    console.log("executing", context.nodeId, context);
  }
  const session = new ChatSession(config, params?.manifest ?? {});

  const prompt = params?.prompt ?? [context.inputs].filter((a) => a !== undefined).join("\n\n");
  // console.log(prompt);
  session.append_user_question(prompt);

  await session.call_loop(() => {});

  // console.log(session.history)
  const message = (() => {
    if (params.function_result) {
      return session.history.messages().find((m) => m.role === "function_result");
    }
    return session.history.last_message();
  })();
  if (message === undefined) {
    throw new Error("No message in the history");
  }
  const result = { answer: message.content, function_data: message.function_data };
  return result;
};
