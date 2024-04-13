import path from "path";
import { AgentFunction } from "@/graphai";
import { ChatSession, ChatConfig, ManifestData } from "slashgpt";

const config = new ChatConfig(path.resolve(__dirname));

export const slashGPTAgent: AgentFunction<{ manifest: ManifestData; query?: string; function_result?: boolean }, { content: string }> = async (context) => {
  console.log("executing", context.nodeId, context.params);
  const session = new ChatSession(config, context.params.manifest ?? {});

  const query = context.params?.query ? [context.params.query] : [];
  const contents = query.concat(
    context.inputs.map((input) => {
      return input.content;
    }),
  );

  session.append_user_question(contents.join("\n"));
  await session.call_loop(() => {});
  const message = (() => {
    if (context.params?.function_result) {
      return session.history.messages().find((m) => m.role === "function_result");
    }
    return session.history.last_message();
  })();
  if (message === undefined) {
    throw new Error("No message in the history");
  }
  return message;
};
