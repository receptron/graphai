import path from "path";
import { GraphAI, FlowCommand } from "../src/graphai";
import { ChatSession, ChatConfig } from "slashgpt";
import { readManifestData } from "../src/file_utils";

const config = new ChatConfig(path.resolve(__dirname));

const test = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readManifestData(file_path);
  const graph = new GraphAI(graph_data, async (params) => {
    if (params.cmd == FlowCommand.Execute) {
      const node = params.node;
      console.log("executing", node, params.params, params.payload);
      const session = new ChatSession(config, params.params.manifest ?? {});
      const prompt = Object.keys(params.payload).reduce((prompt, key) => {
        return prompt.replace("${" + key + "}", params.payload[key]["answer"]);
      }, params.params.prompt);
      session.append_user_question(prompt);

      await session.call_loop((callback_type: string, data: unknown) => {
        if (callback_type === "bot") {
          const result = { answer: JSON.stringify(data) };
          console.log("completing", node, result.answer);
          graph.feed(node, params.tid, result);
        }
      });
    }
  });
  await graph.run();
};

const main = async () => {
  await test("/graphs/sample3.yml");
  console.log("COMPLETE 1");
};
main();
