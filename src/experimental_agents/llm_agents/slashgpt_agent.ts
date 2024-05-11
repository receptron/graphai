import path from "path";
import { AgentFunction } from "@/graphai";
import { ChatSession, ChatConfig, ManifestData, ChatData } from "slashgpt";

const config = new ChatConfig(path.resolve(__dirname));

export const slashGPTAgent: AgentFunction<
  {
    manifest: ManifestData;
    query?: string;
    function_result?: boolean;
  },
  ChatData[],
  string
> = async ({ params, inputs, debugInfo: { verbose, nodeId }, filterParams }) => {
  if (verbose) {
    console.log("executing", nodeId, params);
  }
  const session = new ChatSession(config, params.manifest ?? {});

  const query = params?.query ? [params.query] : [];
  const contents = query.concat(inputs);

  session.append_user_question(contents.join("\n"));
  await session.call_loop(
    () => {},
    (token: string) => {
      if (filterParams && filterParams.streamTokenCallback && token) {
        filterParams.streamTokenCallback(token);
      }
    },
  );
  return session.history.messages();
};

const slashGPTAgentInfo = {
  name: "slashGPTAgent",
  agent: slashGPTAgent,
  mock: slashGPTAgent,
  samples: [],
  description: "Slash GPT Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default slashGPTAgentInfo;
