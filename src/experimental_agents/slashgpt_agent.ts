import path from "path";
import { AgentFunction } from "@/graphai";
import { ChatSession, ChatConfig, ManifestData } from "slashgpt";

const config = new ChatConfig(path.resolve(__dirname));

export const slashGPTAgent: AgentFunction<{ manifest: ManifestData; query?: string }, { content: string }> = async (context) => {
  console.log("executing", context.nodeId, context.params);
  const session = new ChatSession(config, context.params.manifest ?? {});

  if (context.params?.query) {
    session.append_user_question(context.params.query);
  } else {
    const contents = context.inputs.map((input) => {
      return input.content;
    });
    session.append_user_question(contents.join("\n"));
  }

  await session.call_loop(() => {});
  const message = session.history.last_message();
  if (message === undefined) {
    throw new Error("No message in the history");
  }
  return message;
};
