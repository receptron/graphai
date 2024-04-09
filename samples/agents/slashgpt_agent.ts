import path from "path";
import { NodeExecute } from "@/graphai";
import { ChatSession, ChatConfig, ManifestData } from "slashgpt";

const config = new ChatConfig(path.resolve(__dirname));

export const slashGPTAgent: NodeExecute<{ manifest: ManifestData; prompt: string }, { answer: string }> = async (context) => {
  console.log("executing", context.nodeId, context);
  const session = new ChatSession(config, context.params?.manifest ?? {});
  
  const prompt = [context.params?.prompt, context.payload.inputData].join("\n\n");
  session.append_user_question(prompt);

  await session.call_loop(() => {});
  const message = session.history.last_message();
  if (message === undefined) {
    throw new Error("No message in the history");
  }
  const result = { answer: message.content };
  return result;
};

